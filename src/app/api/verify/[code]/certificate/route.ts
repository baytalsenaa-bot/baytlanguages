import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateCertificatePdf } from "@/lib/certificate/generate";
import { maskClientName, type VisibilityMode } from "@/lib/documents/mask-name";

const SIGNED_URL_TTL_SECONDS = 90;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const normalizedCode = code.trim().toUpperCase();

  const supabaseAdmin = createAdminClient();

  const { data: verification } = await supabaseAdmin
    .from("verification_records")
    .select("id, document_id, status, certificate_storage_path")
    .eq("reference_code", normalizedCode)
    .maybeSingle();

  if (!verification || verification.status !== "verified") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Already generated for the current version — just re-sign and redirect.
  if (verification.certificate_storage_path) {
    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
      .from("documents")
      .createSignedUrl(verification.certificate_storage_path, SIGNED_URL_TTL_SECONDS);

    if (signedUrlError || !signedUrlData) {
      console.error("Failed to sign existing certificate:", signedUrlError);
      return NextResponse.json({ error: "Certificate unavailable" }, { status: 500 });
    }

    return NextResponse.redirect(signedUrlData.signedUrl);
  }

  const { data: document } = await supabaseAdmin
    .from("translation_documents")
    .select(
      "title, description, category, classification, client_public_name, client_visibility_mode, client_type, original_language, translated_language, original_page_count, translated_page_count, requested_at, translation_started_at, translation_completed_at, review_completed_at, delivered_at, certification_number",
    )
    .eq("id", verification.document_id)
    .single();

  const { data: currentVersion } = await supabaseAdmin
    .from("document_versions")
    .select("version_number, sha256_hash")
    .eq("document_id", verification.document_id)
    .eq("is_current", true)
    .single();

  if (!document || !currentVersion) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const verifyUrl = `${siteUrl}/verify/${normalizedCode}`;

  const pdfBuffer = await generateCertificatePdf(
    {
      referenceCode: normalizedCode,
      status: verification.status,
      title: document.title,
      description: document.description,
      category: document.category,
      classification: document.classification,
      clientDisplayName: maskClientName(
        document.client_public_name,
        document.client_visibility_mode as VisibilityMode,
      ),
      clientType: document.client_type,
      originalLanguage: document.original_language,
      translatedLanguage: document.translated_language,
      originalPageCount: document.original_page_count,
      translatedPageCount: document.translated_page_count,
      requestedAt: document.requested_at,
      translationStartedAt: document.translation_started_at,
      translationCompletedAt: document.translation_completed_at,
      reviewCompletedAt: document.review_completed_at,
      deliveredAt: document.delivered_at,
      certificationNumber: document.certification_number,
      currentVersionNumber: currentVersion.version_number,
      currentSha256Hash: currentVersion.sha256_hash,
    },
    verifyUrl,
  );

  const certificatePath = `${verification.document_id}/certificate.pdf`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("documents")
    .upload(certificatePath, pdfBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (uploadError) {
    console.error("Failed to upload certificate:", uploadError);
    return NextResponse.json({ error: "Certificate unavailable" }, { status: 500 });
  }

  await supabaseAdmin
    .from("verification_records")
    .update({
      certificate_storage_path: certificatePath,
      certificate_generated_at: new Date().toISOString(),
    })
    .eq("id", verification.id);

  const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
    .from("documents")
    .createSignedUrl(certificatePath, SIGNED_URL_TTL_SECONDS);

  if (signedUrlError || !signedUrlData) {
    console.error("Failed to sign new certificate:", signedUrlError);
    return NextResponse.json({ error: "Certificate unavailable" }, { status: 500 });
  }

  return NextResponse.redirect(signedUrlData.signedUrl);
}
