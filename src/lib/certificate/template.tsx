import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { resolveFontFamily } from "@/lib/pdf/fonts";
import {
  LETTERHEAD,
  LETTERHEAD_HEADER_CLEARANCE,
  LETTERHEAD_FOOTER_CLEARANCE,
  LETTERHEAD_SUBTITLE_TOP,
} from "@/lib/pdf/letterhead";

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
    top: LETTERHEAD_SUBTITLE_TOP,
    right: 40,
    fontSize: 8.5,
    color: MUTED,
    letterSpacing: 0.6,
  },

  body: {
    marginTop: LETTERHEAD_HEADER_CLEARANCE,
    marginBottom: LETTERHEAD_FOOTER_CLEARANCE,
    paddingHorizontal: 40,
  },
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
  const fontFamily = resolveFontFamily(data.title, data.description, data.clientDisplayName);

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
