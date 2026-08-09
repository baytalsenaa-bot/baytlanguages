import fs from "node:fs";
import path from "node:path";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Font,
  Svg,
  Path,
  Circle,
  Rect,
} from "@react-pdf/renderer";

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
const RED = "#e63946";
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

const LOGO_BADGE = loadImage("public/logo/bayt-languages-badge.png");
const LOGO_WATERMARK = loadImage("public/logo/bayt-languages-watermark.png");

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 56,
    paddingHorizontal: 40,
    fontSize: 9.5,
    fontFamily: "Almarai",
    color: "#26272b",
  },
  watermark: {
    position: "absolute",
    width: 110,
    height: 203,
    bottom: 64,
    right: 40,
  },

  // Header / letterhead
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  logo: { width: 68, height: 68 },
  headerTextBlock: { alignItems: "flex-end" },
  brandEn: { fontSize: 19, fontWeight: 700, color: NAVY },
  brandAr: { fontSize: 17, fontWeight: 700, color: NAVY, marginTop: 1 },
  certifiedLine: {
    fontSize: 14,
    fontWeight: 700,
    color: RED,
    letterSpacing: 1.2,
    marginTop: 6,
  },
  certifiedSub: {
    fontSize: 8.5,
    color: MUTED,
    marginTop: 2,
    letterSpacing: 0.6,
  },
  dividerRow: { flexDirection: "row", alignItems: "center", marginTop: 14 },
  dividerLine: { flex: 1, height: 1.4, backgroundColor: NAVY },

  // Body
  body: { marginTop: 14 },
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

  hashLabel: { fontSize: 8, color: MUTED, marginTop: 2 },
  hashValue: {
    fontFamily: "Courier",
    fontSize: 7.5,
    color: "#1c1d21",
    marginTop: 3,
  },

  legal: {
    marginTop: 10,
    fontSize: 7,
    lineHeight: 1.35,
    color: MUTED,
    textAlign: "center",
  },

  // Footer bar (fixed)
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e3e5ea",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footerItem: { flexDirection: "row", alignItems: "center", marginHorizontal: 10 },
  footerIcon: { marginRight: 5 },
  footerText: { fontSize: 8, color: NAVY, fontWeight: 700 },
  footerDivider: { width: 1, height: 10, backgroundColor: "#d6d9de", marginHorizontal: 10 },
});

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function GlobeIcon() {
  return (
    <Svg width="9" height="9" viewBox="0 0 24 24" style={styles.footerIcon}>
      <Circle cx="12" cy="12" r="9.5" stroke={RED} strokeWidth={1.6} fill="none" />
      <Path d="M2.5 12h19" stroke={RED} strokeWidth={1.6} />
      <Path
        d="M12 2.5c3 3 3 16 0 19M12 2.5c-3 3-3 16 0 19"
        stroke={RED}
        strokeWidth={1.6}
        fill="none"
      />
    </Svg>
  );
}

function EnvelopeIcon() {
  return (
    <Svg width="10" height="9" viewBox="0 0 24 20" style={styles.footerIcon}>
      <Rect x="1" y="1" width="22" height="18" rx="2" stroke={RED} strokeWidth={1.6} fill="none" />
      <Path d="M1 2.5l11 9 11-9" stroke={RED} strokeWidth={1.6} fill="none" />
    </Svg>
  );
}

function PhoneIcon() {
  return (
    <Svg width="9" height="9" viewBox="0 0 24 24" style={styles.footerIcon}>
      <Path
        d="M5 3h3.2l1.6 4.6-2.2 2c1.2 2.6 3.2 4.6 5.8 5.8l2-2.2 4.6 1.6V18c0 1.7-1.3 3-3 3-8.3 0-15-6.7-15-15 0-1.7 1.3-3 3-3z"
        fill={RED}
      />
    </Svg>
  );
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
        <Image src={LOGO_WATERMARK} style={styles.watermark} fixed />

        <View style={styles.headerRow} fixed>
          <Image src={LOGO_BADGE} style={styles.logo} />
          <View style={styles.headerTextBlock}>
            <Text style={styles.brandEn}>Bayt Languages</Text>
            <Text style={styles.brandAr}>بيت اللغات</Text>
            <Text style={styles.certifiedLine}>CERTIFIED TRANSLATION</Text>
            <Text style={styles.certifiedSub}>Digital Verification Certificate</Text>
          </View>
        </View>
        <View style={styles.dividerRow} fixed>
          <View style={styles.dividerLine} />
        </View>

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

          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>File integrity</Text>
            <Text style={styles.label}>File version</Text>
            <Text style={styles.value}>v{data.currentVersionNumber}</Text>
            <Text style={styles.hashLabel}>SHA-256 fingerprint</Text>
            <Text style={styles.hashValue}>{data.currentSha256Hash}</Text>
          </View>

          <Text style={styles.legal}>
            This certificate confirms that the document described above was translated and
            issued by Bayt Languages. Any alteration of the translated document invalidates
            this verification.
          </Text>
        </View>

        <View style={styles.footer} fixed>
          <View style={styles.footerItem}>
            <GlobeIcon />
            <Text style={styles.footerText}>www.baytlanguages.com</Text>
          </View>
          <View style={styles.footerDivider} />
          <View style={styles.footerItem}>
            <EnvelopeIcon />
            <Text style={styles.footerText}>info@baytlanguages.com</Text>
          </View>
          <View style={styles.footerDivider} />
          <View style={styles.footerItem}>
            <PhoneIcon />
            <Text style={styles.footerText}>+20 115 424 4807</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
