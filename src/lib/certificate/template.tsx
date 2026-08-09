import fs from "node:fs";
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

// Almarai has no CJK glyphs, so a document with Chinese text (title, client
// name, description) needs Noto Sans SC registered as a separate family and
// selected at render time — see resolveFontFamily below.
Font.register({
  family: "NotoSansSC",
  fonts: [
    { src: path.join(process.cwd(), "public/fonts/NotoSansSC-Regular.otf"), fontWeight: "normal" },
    { src: path.join(process.cwd(), "public/fonts/NotoSansSC-Bold.otf"), fontWeight: "bold" },
  ],
});

const CJK_RANGE = /[一-鿿㐀-䶿豈-﫿]/;

function resolveFontFamily(data: CertificateData): "Almarai" | "NotoSansSC" {
  const combined = [data.title, data.description, data.clientDisplayName].join(" ");
  return CJK_RANGE.test(combined) ? "NotoSansSC" : "Almarai";
}

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

const NAVY = "#0d1b3d";
const MUTED = "#6b7280";

// @react-pdf/renderer's local-path image resolution is unreliable on this
// setup (fails silently, producing a blank image) — reading the file into a
// buffer ourselves and passing { data, format } sidesteps its path/fetch
// resolver entirely.
function loadImage(relativePath: string) {
  return {
    data: fs.readFileSync(path.join(process.cwd(), relativePath)),
    format: "png" as const,
  };
}

// The official company letterhead (logo, bilingual title, divider, watermark,
// and contact footer) is used as-is as the page background — the
// verification content below is laid out to fit inside its white body area.
const LETTERHEAD = loadImage("public/logo/certificate-letterhead.png");

const styles = StyleSheet.create({
  page: {
    fontSize: 9.5,
    fontFamily: "Almarai",
    color: "#26272b",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  subtitle: {
    position: "absolute",
    top: 152,
    right: 40,
    fontSize: 8.5,
    color: MUTED,
    letterSpacing: 0.6,
  },

  // Body — positioned to clear the letterhead's header divider (~191pt from
  // the top) and footer contact bar (~50pt from the bottom).
  body: { marginTop: 208, marginBottom: 66, paddingHorizontal: 40 },
  statusBlock: { alignItems: "center", marginBottom: 12 },
  docTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: NAVY,
    textAlign: "center",
    maxWidth: 420,
  },
  statusBadgeRow: { flexDirection: "row", alignItems: "center", marginTop: 10, gap: 6 },
  statusBadge: {
    fontSize: 10,
    fontWeight: 700,
    color: "#ffffff",
    backgroundColor: NAVY,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 3,
    letterSpacing: 0.8,
  },
  referenceCode: {
    fontSize: 13,
    fontFamily: "Courier",
    fontWeight: 700,
    color: NAVY,
    marginTop: 10,
    letterSpacing: 1,
  },
  qr: { width: 82, height: 82, alignSelf: "center", marginTop: 10, marginBottom: 2 },

  sectionCard: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#e3e5ea",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
  },
  sectionHeading: {
    fontSize: 8.5,
    fontWeight: 700,
    color: NAVY,
    letterSpacing: 1.2,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: { width: "50%", marginBottom: 5, paddingRight: 10 },
  label: { fontSize: 8, color: MUTED, letterSpacing: 0.4 },
  value: { fontSize: 9.5, color: "#1c1d21", fontWeight: 700, marginTop: 1 },

  legal: {
    marginTop: 10,
    fontSize: 7,
    lineHeight: 1.35,
    color: MUTED,
    textAlign: "center",
  },
});

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.cell}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export function CertificateDocument(data: CertificateData) {
  const fontFamily = resolveFontFamily(data);

  return (
    <Document>
      <Page size="A4" style={[styles.page, { fontFamily }]}>
        <Image src={LETTERHEAD} style={styles.background} fixed />
        <Text style={styles.subtitle} fixed>
          Digital Verification Certificate
        </Text>

        <View style={styles.body}>
          <View style={styles.statusBlock}>
            <Text style={styles.docTitle}>{data.title}</Text>
            <View style={styles.statusBadgeRow}>
              <Text style={styles.statusBadge}>
                {data.status === "verified" ? "VERIFIED" : data.status.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.referenceCode}>{data.referenceCode}</Text>
            <Image src={data.qrDataUrl} style={styles.qr} />
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>Document details</Text>
            <View style={styles.grid}>
              <Cell label="Client" value={data.clientDisplayName} />
              <Cell label="Client type" value={data.clientType} />
              <Cell label="Document category" value={data.category} />
              <Cell label="Classification" value={data.classification} />
              <Cell label="Original language" value={data.originalLanguage} />
              <Cell label="Translated language" value={data.translatedLanguage} />
              <Cell label="Original pages" value={String(data.originalPageCount)} />
              <Cell label="Translated pages" value={String(data.translatedPageCount)} />
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>Timeline</Text>
            <View style={styles.grid}>
              <Cell label="Requested" value={formatDate(data.requestedAt)} />
              <Cell label="Translation started" value={formatDate(data.translationStartedAt)} />
              <Cell
                label="Translation completed"
                value={formatDate(data.translationCompletedAt)}
              />
              <Cell label="Review completed" value={formatDate(data.reviewCompletedAt)} />
              <Cell label="Delivered" value={formatDate(data.deliveredAt)} />
              <Cell label="Certification number" value={data.certificationNumber ?? "—"} />
            </View>
          </View>

          <Text style={styles.legal}>
            This certificate confirms that the document described above was translated and
            issued by Bayt Languages. Any alteration of the translated document invalidates
            this verification.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
