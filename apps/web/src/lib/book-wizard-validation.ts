import { z } from 'zod';

// Step 1: Book Identification
export const bookIdentificationSchema = z.object({
  searchMethod: z.enum(['api', 'manual']),
  selectedBook: z.object({
    title: z.string(),
    author: z.string(),
    isbn: z.string().optional(),
    coverUrl: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  isbn: z.string().optional(),
  seriesName: z.string().optional(),
  seriesNumber: z.string().optional(),
});

// Step 2: Edition Details
export const editionDetailsSchema = z.object({
  editionType: z.enum(['special', 'first', 'standard']),
  subscriptionBoxes: z.array(z.string()),
  isSigned: z.boolean(),
  signatureType: z.enum(['hand', 'bookplate', 'digital', 'other']).optional(),
  specialFeatures: z.object({
    paintedEdges: z.boolean(),
    paintedEdgesColor: z.string().optional(),
    dustJacket: z.boolean(),
    firstEdition: z.boolean(),
    exclusiveCover: z.boolean(),
  }),
  additionalDetails: z.string().optional(),
});

// Step 3: Condition Grading
export const conditionGradingSchema = z.object({
  condition: z.enum(['new', 'like-new', 'very-good', 'good', 'acceptable']),
  conditionNotes: z.string().min(20, 'Please provide detailed condition notes (minimum 20 characters)'),
});

// Step 4: Photos (validated separately due to File objects)
export const photosSchema = z.object({
  images: z.array(z.any()).min(3, 'Please upload at least 3 photos'),
});

// Step 5: Tropes & Tags
export const tropesAndTagsSchema = z.object({
  tropes: z.array(z.string()).min(1, 'Please select at least one trope'),
  spiceLevel: z.number().min(0).max(5),
});

// Step 6: Pricing & Shipping
export const pricingAndShippingSchema = z.object({
  price: z.string()
    .refine((val) => !isNaN(parseFloat(val)), 'Must be a valid number')
    .refine((val) => parseFloat(val) >= 5, 'Price must be at least $5')
    .refine((val) => parseFloat(val) <= 500, 'Price must not exceed $500'),
  acceptsOffers: z.boolean(),
  enableAuction: z.boolean(),
  startingBid: z.string().optional(),
  reservePrice: z.string().optional(),
  shippingPrice: z.string(),
  localPickupAvailable: z.boolean(),
  zipCode: z.string().optional(),
  allowBundles: z.boolean(),
});

// Step 7: Your Story
export const yourStorySchema = z.object({
  description: z.string()
    .min(50, 'Please share at least 50 characters about your book')
    .max(1000, 'Description must not exceed 1000 characters'),
});

// Complete wizard validation
export const completeWizardSchema = z.object({
  bookIdentification: bookIdentificationSchema,
  editionDetails: editionDetailsSchema,
  conditionGrading: conditionGradingSchema,
  photos: photosSchema,
  tropesAndTags: tropesAndTagsSchema,
  pricingAndShipping: pricingAndShippingSchema,
  yourStory: yourStorySchema,
});

export type BookWizardFormData = z.infer<typeof completeWizardSchema>;
