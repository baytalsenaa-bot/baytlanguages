import "server-only";
import { renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { CertificateDocument, type CertificateData } from "./template";

export async function generateCertificatePdf(
  data: Omit<CertificateData, "qrDataUrl">,
  verifyUrl: string,
): Promise<Buffer> {
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 240, margin: 1 });
  return renderToBuffer(<CertificateDocument {...data} qrDataUrl={qrDataUrl} />);
}
