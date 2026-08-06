import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyPin } from "@/lib/documents/pin";

const SIGNED_URL_TTL_SECONDS = 90;
const MAX_PIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code.trim().toUpperCase() : null;
  const pin = typeof body?.pin === "string" ? body.pin.trim() : undefined;

  if (!code) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const supabaseAdmin = createAdminClient();

  // Service-role client: this is the one place pin_hash is readable at all — the
  // anon-facing public_verification_view never selects it.
  const { data: verification } = await supabaseAdmin
    .from("verification_records")
    .select("id, document_id, status, pin_enabled, pin_hash, pin_failed_attempts, pin_locked_until")
    .eq("reference_code", code)
    .maybeSingle();

  // Deliberately generic: don't distinguish "no such code" from "wrong PIN" from
  // "not verified" from "locked out" in the response, to avoid handing a
  // brute-forcer an oracle.
  const genericError = NextResponse.json(
    { error: "This document is not available for download." },
    { status: 401 },
  );

  if (!verification || verification.status !== "verified") {
    return genericError;
  }

  if (verification.pin_enabled) {
    const lockedUntil = verification.pin_locked_until
      ? new Date(verification.pin_locked_until)
      : null;

    if (lockedUntil && lockedUntil > new Date()) {
      return genericError;
    }

    if (!pin || !verification.pin_hash) {
      return genericError;
    }

    const pinMatches = await verifyPin(pin, verification.pin_hash);

    if (!pinMatches) {
      const attempts = verification.pin_failed_attempts + 1;
      const lockingOut = attempts >= MAX_PIN_ATTEMPTS;

      await supabaseAdmin
        .from("verification_records")
        .update({
          pin_failed_attempts: lockingOut ? 0 : attempts,
          pin_locked_until: lockingOut
            ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000).toISOString()
            : null,
        })
        .eq("id", verification.id);

      await supabaseAdmin.from("audit_log").insert({
        action: lockingOut ? "pin.locked_out" : "pin.attempt_failed",
        document_id: verification.document_id,
        verification_id: verification.id,
      });

      return genericError;
    }

    if (verification.pin_failed_attempts > 0 || lockedUntil) {
      await supabaseAdmin
        .from("verification_records")
        .update({ pin_failed_attempts: 0, pin_locked_until: null })
        .eq("id", verification.id);
    }
  }

  const { data: currentVersion } = await supabaseAdmin
    .from("document_versions")
    .select("storage_path")
    .eq("document_id", verification.document_id)
    .eq("is_current", true)
    .maybeSingle();

  if (!currentVersion) {
    return genericError;
  }

  const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
    .from("documents")
    .createSignedUrl(currentVersion.storage_path, SIGNED_URL_TTL_SECONDS);

  if (signedUrlError || !signedUrlData) {
    console.error("Failed to create signed URL:", signedUrlError);
    return NextResponse.json({ error: "Download temporarily unavailable" }, { status: 500 });
  }

  await supabaseAdmin.from("audit_log").insert({
    action: "verification.download",
    document_id: verification.document_id,
    verification_id: verification.id,
  });

  return NextResponse.json({ url: signedUrlData.signedUrl });
}
