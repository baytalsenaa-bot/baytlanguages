import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateReceiptPdf } from "@/lib/receipt/generate";
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
    .select("id, document_id, status, reference_code")
    .eq("reference_code", normalizedCode)
    .maybeSingle();

  if (!verification || verification.status !== "verified") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: receipt } = await supabaseAdmin
    .from("receipts")
    .select(
      "id, receipt_number, status, total_character_count, rate_description, base_cost, base_currency, equivalent_cost, equivalent_currency, discount_percent, discounted_amount, final_amount, amount_paid, notes, issued_at, receipt_storage_path",
    )
    .eq("document_id", verification.document_id)
    .maybeSingle();

  if (!receipt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Already generated — just re-sign and redirect.
  if (receipt.receipt_storage_path) {
    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
      .from("documents")
      .createSignedUrl(receipt.receipt_storage_path, SIGNED_URL_TTL_SECONDS);

    if (signedUrlError || !signedUrlData) {
      console.error("Failed to sign existing receipt:", signedUrlError);
      return NextResponse.json({ error: "Receipt unavailable" }, { status: 500 });
    }

    return NextResponse.redirect(signedUrlData.signedUrl);
  }

  const { data: document } = await supabaseAdmin
    .from("translation_documents")
    .select(
      "title, category, classification, client_public_name, client_visibility_mode, client_type, original_language, translated_language, original_page_count, translated_page_count",
    )
    .eq("id", verification.document_id)
    .single();

  if (!document) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const pdfBuffer = await generateReceiptPdf({
    receiptNumber: receipt.receipt_number,
    referenceCode: verification.reference_code,
    issuedAt: receipt.issued_at,
    status: receipt.status,
    clientDisplayName: maskClientName(
      document.client_public_name,
      document.client_visibility_mode as VisibilityMode,
    ),
    clientType: document.client_type,
    documentTitle: document.title,
    category: document.category,
    classification: document.classification,
    originalLanguage: document.original_language,
    translatedLanguage: document.translated_language,
    originalPageCount: document.original_page_count,
    translatedPageCount: document.translated_page_count,
    totalCharacterCount: receipt.total_character_count,
    rateDescription: receipt.rate_description,
    baseCost: receipt.base_cost,
    baseCurrency: receipt.base_currency,
    equivalentCost: receipt.equivalent_cost,
    equivalentCurrency: receipt.equivalent_currency,
    discountPercent: receipt.discount_percent,
    discountedAmount: receipt.discounted_amount,
    finalAmount: receipt.final_amount,
    amountPaid: receipt.amount_paid,
    notes: receipt.notes,
  });

  const receiptPath = `${verification.document_id}/receipt.pdf`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("documents")
    .upload(receiptPath, pdfBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (uploadError) {
    console.error("Failed to upload receipt:", uploadError);
    return NextResponse.json({ error: "Receipt unavailable" }, { status: 500 });
  }

  await supabaseAdmin
    .from("receipts")
    .update({
      receipt_storage_path: receiptPath,
      receipt_generated_at: new Date().toISOString(),
    })
    .eq("id", receipt.id);

  const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
    .from("documents")
    .createSignedUrl(receiptPath, SIGNED_URL_TTL_SECONDS);

  if (signedUrlError || !signedUrlData) {
    console.error("Failed to sign new receipt:", signedUrlError);
    return NextResponse.json({ error: "Receipt unavailable" }, { status: 500 });
  }

  return NextResponse.redirect(signedUrlData.signedUrl);
}
