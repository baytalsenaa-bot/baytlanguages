import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { resolveFontFamily } from "@/lib/pdf/fonts";
import {
  LETTERHEAD,
  LETTERHEAD_HEADER_CLEARANCE,
  LETTERHEAD_FOOTER_CLEARANCE,
  LETTERHEAD_SUBTITLE_TOP,
} from "@/lib/pdf/letterhead";

export type ReceiptData = {
  receiptNumber: string;
  referenceCode: string;
  issuedAt: string;
  status: string;

  clientDisplayName: string;
  clientType: string;
  documentTitle: string;
  category: string;
  classification: string;
  originalLanguage: string;
  translatedLanguage: string;
  originalPageCount: number;
  translatedPageCount: number;

  totalCharacterCount: number | null;
  rateDescription: string | null;
  baseCost: number | null;
  baseCurrency: string | null;
  equivalentCost: number | null;
  equivalentCurrency: string;

  discountPercent: number;
  discountedAmount: number | null;
  finalAmount: number;
  amountPaid: number;

  notes: string | null;
};

const NAVY = "#0d1b3d";
const RED = "#e63946";
const MUTED = "#6b7280";

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Pending Payment",
  partially_paid: "Partially Paid",
  paid: "Paid",
  cancelled: "Cancelled",
};

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
  pageTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: NAVY,
    textAlign: "center",
    marginBottom: 10,
  },

  section: { marginTop: 6 },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 3,
  },
  sectionBar: { width: 3, height: 11, backgroundColor: RED },
  sectionHeadingText: {
    fontSize: 9.5,
    fontWeight: 700,
    color: NAVY,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e3e5ea",
    paddingVertical: 3,
  },
  rowLabel: { fontSize: 8.5, color: MUTED, width: "40%" },
  rowValue: { fontSize: 9, color: "#1c1d21", width: "58%", textAlign: "right" },
  rowValueEmphasis: { fontWeight: 700, color: NAVY },

  notesList: { marginTop: 3 },
  noteItem: { flexDirection: "row", marginBottom: 2 },
  noteBullet: { fontSize: 8.5, color: RED, marginRight: 5 },
  noteText: { fontSize: 8, color: MUTED, flex: 1, lineHeight: 1.3 },

  signature: { marginTop: 16 },
  signatureLine: { width: 160, borderTopWidth: 1, borderTopColor: "#9aa0ac" },
  signatureLabel: { fontSize: 7.5, color: MUTED, marginTop: 3 },
});

function Row({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, emphasis ? styles.rowValueEmphasis : {}]}>{value}</Text>
    </View>
  );
}

function SectionHeading({ children }: { children: string }) {
  return (
    <View style={styles.sectionHeading}>
      <View style={styles.sectionBar} />
      <Text style={styles.sectionHeadingText}>{children}</Text>
    </View>
  );
}

function formatMoney(value: number | null, currency: string | null) {
  if (value === null || !currency) return "—";
  return `${value.toFixed(2)} ${currency}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ReceiptDocument(data: ReceiptData) {
  const fontFamily = resolveFontFamily(data.documentTitle, data.clientDisplayName, data.notes);
  const balanceDue = data.finalAmount - data.amountPaid;

  return (
    <Document>
      <Page size="A4" style={[styles.page, { fontFamily }]}>
        <Image src={LETTERHEAD} style={styles.background} fixed />
        <Text style={styles.subtitle} fixed>
          Translation Cost Receipt
        </Text>

        <View style={styles.body}>
          <Text style={styles.pageTitle}>TRANSLATION COST RECEIPT</Text>

          <View style={styles.section}>
            <SectionHeading>1. RECEIPT INFORMATION</SectionHeading>
            <Row label="Receipt No." value={data.receiptNumber} emphasis />
            <Row label="Reference No." value={data.referenceCode} />
            <Row label="Issue Date" value={formatDate(data.issuedAt)} />
            <Row label="Status" value={STATUS_LABELS[data.status] ?? data.status} />
          </View>

          <View style={styles.section}>
            <SectionHeading>2. CLIENT & DOCUMENT DETAILS</SectionHeading>
            <Row label="Client" value={data.clientDisplayName} />
            <Row label="Client Type" value={data.clientType} />
            <Row label="Document Title" value={data.documentTitle} />
            <Row label="Document Category" value={data.category} />
            <Row label="Classification" value={data.classification} />
            <Row label="Original Language" value={data.originalLanguage} />
            <Row label="Translated Language" value={data.translatedLanguage} />
            <Row label="Original Pages" value={String(data.originalPageCount)} />
            <Row label="Translated Pages" value={String(data.translatedPageCount)} />
          </View>

          <View style={styles.section}>
            <SectionHeading>3. COST CALCULATION</SectionHeading>
            <Row
              label="Total Character Count"
              value={data.totalCharacterCount !== null ? `${data.totalCharacterCount} characters` : "—"}
            />
            <Row label="Rate" value={data.rateDescription ?? "—"} />
            <Row label="Base Cost" value={formatMoney(data.baseCost, data.baseCurrency)} />
            <Row
              label={`Equivalent Cost in ${data.equivalentCurrency}`}
              value={formatMoney(data.equivalentCost, data.equivalentCurrency)}
            />
          </View>

          <View style={styles.section}>
            <SectionHeading>4. DISCOUNT & PAYMENT SUMMARY</SectionHeading>
            <Row label="Discount" value={`${data.discountPercent}%`} />
            <Row
              label="Discounted Amount"
              value={formatMoney(data.discountedAmount, data.equivalentCurrency)}
            />
            <Row
              label="Final Agreed Amount"
              value={formatMoney(data.finalAmount, data.equivalentCurrency)}
              emphasis
            />
            <Row
              label="Amount Paid"
              value={formatMoney(data.amountPaid, data.equivalentCurrency)}
              emphasis
            />
            <Row
              label="Balance Due"
              value={formatMoney(balanceDue, data.equivalentCurrency)}
              emphasis
            />
          </View>

          {data.notes && (
            <View style={styles.section}>
              <SectionHeading>5. NOTES</SectionHeading>
              <View style={styles.notesList}>
                {data.notes
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((line) => (
                    <View key={line} style={styles.noteItem}>
                      <Text style={styles.noteBullet}>•</Text>
                      <Text style={styles.noteText}>{line}</Text>
                    </View>
                  ))}
              </View>
            </View>
          )}

          <View style={styles.signature}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Authorized Signature</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
