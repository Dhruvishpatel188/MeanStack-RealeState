const { z } = require("zod")

// ── Add Property Validation Schema ──
const addPropertySchema = z.object({
    title: z
        .string({ required_error: "Title is required" })
        .min(5, "Title must be at least 5 characters")
        .max(200, "Title too long"),

    description: z
        .string({ required_error: "Description is required" })
        .min(20, "Description must be at least 20 characters"),

    propertyType: z.enum(["House", "Apartment", "Land", "Commercial", "Villa", "Plot"], {
        required_error: "Property type is required",
    }),

    listingType: z.enum(["Sale", "Rent"], {
        required_error: "Listing type is required",
    }),

    price: z
        .union([z.string(), z.number()])
        .transform((v) => Number(v))
        .refine((v) => v > 0, "Price must be a positive number"),

    area: z
        .union([z.string(), z.number()])
        .transform((v) => Number(v))
        .optional(),

    bedrooms: z
        .union([z.string(), z.number()])
        .transform((v) => Number(v))
        .optional(),

    bathrooms: z
        .union([z.string(), z.number()])
        .transform((v) => Number(v))
        .optional(),

    furnishing: z
        .enum(["Furnished", "Semi-Furnished", "Unfurnished"])
        .default("Unfurnished")
        .optional(),

    parking: z
        .union([z.boolean(), z.string()])
        .transform((v) => v === true || v === "true")
        .optional(),

    // location fields
    address: z
        .string({ required_error: "Address is required" })
        .min(5, "Address is too short"),

    city: z
        .string({ required_error: "City is required" })
        .min(2, "City name is too short"),

    state: z
        .string({ required_error: "State is required" })
        .min(2, "State name is too short"),

    pincode: z
        .string({ required_error: "Pincode is required" })
        .regex(/^[0-9]{4,10}$/, "Invalid pincode"),

    country: z.string().default("India").optional(),

    latitude: z
        .union([z.string(), z.number()])
        .transform((v) => (v ? Number(v) : undefined))
        .optional(),

    longitude: z
        .union([z.string(), z.number()])
        .transform((v) => (v ? Number(v) : undefined))
        .optional(),
})

// ── Inquiry Validation Schema ──
const inquirySchema = z.object({
    propertyId: z
        .string({ required_error: "Property ID is required" })
        .length(24, "Invalid property ID"),

    message: z
        .string({ required_error: "Message is required" })
        .min(10, "Message must be at least 10 characters"),

    contactPhone: z.string().optional(),
    contactEmail: z.string().email("Invalid email").optional(),
})

// ── Review Validation Schema ──
const reviewSchema = z.object({
    propertyId: z
        .string({ required_error: "Property ID is required" })
        .length(24, "Invalid property ID"),

    rating: z
        .union([z.string(), z.number()])
        .transform((v) => Number(v))
        .refine((v) => v >= 1 && v <= 5, "Rating must be between 1 and 5"),

    comment: z.string().max(500, "Comment too long").optional(),
})

// ── Support Ticket Validation Schema ──
const supportTicketSchema = z.object({
    subject: z
        .string({ required_error: "Subject is required" })
        .min(5, "Subject must be at least 5 characters")
        .max(200, "Subject too long"),

    description: z
        .string({ required_error: "Description is required" })
        .min(20, "Description must be at least 20 characters"),
})

module.exports = {
    addPropertySchema,
    inquirySchema,
    reviewSchema,
    supportTicketSchema,
}
