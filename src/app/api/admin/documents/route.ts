import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createDocumentSchema } from "@/lib/validations/document";
import { sha256Hex } from "@/lib/documents/hashing";
import { generateReferenceCode } from "@/lib/documents/reference-code";
import { hashPin } from "@/lib/documents/pin";

const MAX_REFERENCE_CODE_ATTEMPTS = 5;

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: staff } = await supabase
    .from("staff_profiles")
    .select("is_active")
    .eq("id", user.id)
    .single();

  if (!staff?.is_active) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.type !== "application/pdf") {
    return NextResponse.json({ error: "A PDF file is required" }, { status: 400 });
  }

  const rawFields = Object.fromEntries(formData.entries());
  const parsed = createDocumentSchema.safeParse(rawFields);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const input = parsed.data;

  if (input.pinEnabled && !input.pin) {
    return NextResponse.json(
      { error: "A PIN is required when PIN protection is enabled" },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const sha256Hash = sha256Hex(buffer);

  const { data: document, error: documentError } = await supabase
    .from("translation_documents")
    .insert({
      created_by: user.id,
      client_public_name: input.clientPublicName,
      client_visibility_mode: input.clientVisibilityMode,
      client_type: input.clientType,
      title: input.title,
      description: input.description || null,
      category: input.category,
      classification: input.classification,
      original_language: input.originalLanguage,
      translated_language: input.translatedLanguage,
      original_page_count: input.originalPageCount,
      translated_page_count: input.translatedPageCount,
      requested_at: input.requestedAt || null,
      translation_started_at: input.translationStartedAt || null,
      translation_completed_at: input.translationCompletedAt || null,
      review_completed_at: input.reviewCompletedAt || null,
      delivered_at: input.deliveredAt || null,
      certification_number: input.certificationNumber || null,
      internal_notes: input.internalNotes || null,
    })
    .select("id")
    .single();

  if (documentError || !document) {
    console.error("Failed to create document:", documentError);
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
  }

  const documentId = document.id as string;
  const storagePath = `${documentId}/v1-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(storagePath, buffer, { contentType: "application/pdf", upsert: false });

  if (uploadError) {
    console.error("Failed to upload file:", uploadError);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }

  const { error: versionError } = await supabase.from("document_versions").insert({
    document_id: documentId,
    version_number: 1,
    storage_path: storagePath,
    sha256_hash: sha256Hash,
    file_size_bytes: buffer.byteLength,
    original_filename: file.name,
    is_current: true,
    uploaded_by: user.id,
  });

  if (versionError) {
    console.error("Failed to record file version:", versionError);
    return NextResponse.json({ error: "Failed to record file version" }, { status: 500 });
  }

  const pinHash = input.pinEnabled && input.pin ? await hashPin(input.pin) : null;

  let referenceCode: string | null = null;

  for (let attempt = 0; attempt < MAX_REFERENCE_CODE_ATTEMPTS; attempt++) {
    const candidate = generateReferenceCode();

    const { error: verificationError } = await supabase.from("verification_records").insert({
      document_id: documentId,
      reference_code: candidate,
      pin_enabled: input.pinEnabled,
      pin_hash: pinHash,
    });

    if (!verificationError) {
      referenceCode = candidate;
      break;
    }

    // 23505 = unique_violation; regenerate and retry. Any other error is fatal.
    if (verificationError.code !== "23505") {
      console.error("Failed to create verification record:", verificationError);
      return NextResponse.json(
        { error: "Failed to create verification record" },
        { status: 500 },
      );
    }
  }

  if (!referenceCode) {
    return NextResponse.json(
      { error: "Could not generate a unique reference code, please retry" },
      { status: 500 },
    );
  }

  // Audit rows are written with the service-role client only — staff sessions have no
  // insert policy on audit_log, so a compromised session can't tamper with its own trail.
  const supabaseAdmin = createAdminClient();
  await supabaseAdmin.from("audit_log").insert([
    { actor_id: user.id, action: "document.create", document_id: documentId },
    {
      actor_id: user.id,
      action: "document.upload_version",
      document_id: documentId,
      metadata: { version_number: 1 },
    },
    { actor_id: user.id, action: "verification.publish", document_id: documentId },
  ]);

  return NextResponse.json({ documentId, referenceCode }, { status: 201 });
}
