import { z } from "zod";

export const clientTypeValues = [
  "individual",
  "business",
  "government",
  "organization",
  "other",
] as const;

export const visibilityModeValues = ["full", "masked", "hidden"] as const;

export const documentCategoryValues = [
  "legal",
  "medical",
  "academic",
  "business",
  "personal",
  "government",
  "other",
] as const;

export const translationClassificationValues = [
  "certified",
  "notarized",
  "standard",
  "sworn",
] as const;

export const receiptStatusValues = [
  "pending_payment",
  "partially_paid",
  "paid",
  "cancelled",
] as const;

export const createDocumentSchema = z.object({
  clientPublicName: z.string().trim().min(1, "Client name is required"),
  clientVisibilityMode: z.enum(visibilityModeValues),
  clientType: z.enum(clientTypeValues),

  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional(),
  category: z.enum(documentCategoryValues),
  classification: z.enum(translationClassificationValues),
  originalLanguage: z.string().trim().min(1, "Original language is required"),
  translatedLanguage: z.string().trim().min(1, "Translated language is required"),
  originalPageCount: z.coerce.number().int().positive(),
  translatedPageCount: z.coerce.number().int().positive(),

  requestedAt: z.string().optional(),
  translationStartedAt: z.string().optional(),
  translationCompletedAt: z.string().optional(),
  reviewCompletedAt: z.string().optional(),
  deliveredAt: z.string().optional(),

  certificationNumber: z.string().trim().optional(),
  internalNotes: z.string().trim().optional(),

  pinEnabled: z.coerce.boolean().default(false),
  pin: z
    .string()
    .trim()
    .regex(/^\d{4,8}$/, "PIN must be 4–8 digits")
    .optional(),

  receiptEnabled: z.coerce.boolean().default(false),
  receiptStatus: z.enum(receiptStatusValues).default("pending_payment"),
  totalCharacterCount: z.coerce.number().int().nonnegative().optional(),
  rateDescription: z.string().trim().optional(),
  baseCost: z.coerce.number().nonnegative().optional(),
  baseCurrency: z.string().trim().optional(),
  equivalentCost: z.coerce.number().nonnegative().optional(),
  equivalentCurrency: z.string().trim().default("SAR"),
  discountPercent: z.coerce.number().min(0).max(100).default(0),
  discountedAmount: z.coerce.number().nonnegative().optional(),
  finalAmount: z.coerce.number().nonnegative().optional(),
  amountPaid: z.coerce.number().nonnegative().default(0),
  receiptNotes: z.string().trim().optional(),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
