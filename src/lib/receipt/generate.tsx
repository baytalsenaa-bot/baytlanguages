import "server-only";
import { renderToBuffer } from "@react-pdf/renderer";
import { ReceiptDocument, type ReceiptData } from "./template";

export async function generateReceiptPdf(data: ReceiptData): Promise<Buffer> {
  return renderToBuffer(<ReceiptDocument {...data} />);
}
