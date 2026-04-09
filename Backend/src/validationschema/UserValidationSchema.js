const { z } = require("zod")

// ── Register Validation Schema ──
const registerSchema = z.object({
    firstName: z
        .string({ required_error: "First name is required" })
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name too long"),

    lastName: z
        .string({ required_error: "Last name is required" })
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name too long"),

    email: z
        .string({ required_error: "Email is required" })
        .email("Please provide a valid email"),

    password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters")
        .max(50, "Password too long"),

    phone: z
        .string()
        .regex(/^[0-9+\-\s]{7,15}$/, "Invalid phone number")
        .optional(),

    role: z
        .enum(["ADMIN", "AGENT", "OWNER", "BUYER", "SUPPORT"])
        .default("BUYER")
        .optional(),

    gender: z.enum(["Male", "Female", "Other"]).optional(),

    address: z.string().max(200).optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(100).optional(),
    pincode: z.string().max(10).optional(),
})

// ── Login Validation Schema ──
const loginSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email("Please provide a valid email"),

    password: z
        .string({ required_error: "Password is required" })
        .min(1, "Password is required"),
})

// ── Change Password Schema ──
const changePasswordSchema = z.object({
    oldPassword: z
        .string({ required_error: "Old password is required" })
        .min(1, "Old password is required"),

    newPassword: z
        .string({ required_error: "New password is required" })
        .min(6, "New password must be at least 6 characters"),
})

module.exports = {
    registerSchema,
    loginSchema,
    changePasswordSchema,
}
