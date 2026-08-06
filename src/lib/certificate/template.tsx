import path from "node:path";
import { Document, Page, View, Text, Image, StyleSheet, Font } from "@react-pdf/renderer";

// Helvetica (the react-pdf default) only has Latin glyphs — Arabic text in a
// document title/description/client name would otherwise render as garbage
// characters. Almarai covers Arabic + Latin, so it's registered as the one
// font for the whole certificate rather than switching per field.
Font.register({
  family: "Almarai",
  fonts: [
    { src: path.join(process.cwd(), "public/fonts/Almarai-Regular.ttf"), fontWeight: "normal" },
    { src: path.join(process.cwd(), "public/fonts/Almarai-Bold.ttf"), fontWeight: "bold" },
  ],
});

export type CertificateData = {
  referenceCode: string;
  status: string;
  title: string;
  description: string | null;
  category: string;
  classification: string;
  clientDisplayName: string;
  clientType: string;
  originalLanguage: string;
  translatedLanguage: string;
  originalPageCount: number;
  translatedPageCount: number;
  requestedAt: string | null;
  translationStartedAt: string | null;
  translationCompletedAt: string | null;
  reviewCompletedAt: string | null;
  deliveredAt: string | null;
  certificationNumber: string | null;
  currentVersionNumber: number;
  currentSha256Hash: string;
  qrDataUrl: string;
};

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 11, fontFamily: "Almarai", color: "#1a1a1a" },
  header: { textAlign: "center", marginBottom: 24 },
  brand: { fontSize: 10, color: "#666666" },
  title: { fontSize: 18, fontWeight: 700, marginTop: 8 },
  status: { fontSize: 12, color: "#0a7a3d", marginTop: 4 },
  code: { fontSize: 14, marginTop: 8, fontFamily: "Courier" },
  qr: { width: 100, height: 100, alignSelf: "center", marginVertical: 16 },
  section: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
  },
  row: { flexDirection: "row", marginBottom: 6 },
  label: { width: "40%", color: "#666666" },
  value: { width: "60%" },
  hash: { fontFamily: "Courier", fontSize: 8, marginTop: 4 },
  footer: { marginTop: 32, fontSize: 8, color: "#999999", textAlign: "center" },
});

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export function CertificateDocument(data: CertificateData) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>
            Bayt Languages — Digital Translation Verification Certificate
          </Text>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.status}>
            {data.status === "verified" ? "Verified" : data.status.toUpperCase()}
          </Text>
          <Text style={styles.code}>{data.referenceCode}</Text>
          <Image src={data.qrDataUrl} style={styles.qr} />
        </View>

        <View style={styles.section}>
          <Row label="Client" value={data.clientDisplayName} />
          <Row label="Client type" value={data.clientType} />
          <Row label="Document category" value={data.category} />
          <Row label="Classification" value={data.classification} />
          <Row label="Original language" value={data.originalLanguage} />
          <Row label="Translated language" value={data.translatedLanguage} />
          <Row label="Original pages" value={String(data.originalPageCount)} />
          <Row label="Translated pages" value={String(data.translatedPageCount)} />
        </View>

        <View style={styles.section}>
          <Row label="Requested" value={formatDate(data.requestedAt)} />
          <Row
            label="Translation started"
            value={formatDate(data.translationStartedAt)}
          />
          <Row
            label="Translation completed"
            value={formatDate(data.translationCompletedAt)}
          />
          <Row label="Review completed" value={formatDate(data.reviewCompletedAt)} />
          <Row label="Delivered" value={formatDate(data.deliveredAt)} />
          <Row
            label="Certification number"
            value={data.certificationNumber ?? "—"}
          />
        </View>

        <View style={styles.section}>
          <Row label="File version" value={`v${data.currentVersionNumber}`} />
          <Text style={styles.label}>SHA-256 fingerprint</Text>
          <Text style={styles.hash}>{data.currentSha256Hash}</Text>
        </View>

        <Text style={styles.footer}>
          Issued by Bayt Languages. This certificate confirms that the document
          described above was translated and issued by Bayt Languages. Any
          alteration of the translated document invalidates this verification.
          {"\n"}info@baytlanguages.com
        </Text>
      </Page>
    </Document>
  );
}
