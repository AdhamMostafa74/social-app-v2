import { z } from "zod";

export const registerSchema = z
    .object({
        name: z
            .string()
            .min(3, "Name must be at least 3 characters"),

        username: z
            .string()
            .min(3, "Username must be at least 3 characters")
            .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscore allowed"),

        email: z
            .email("Invalid email address"),

        dateOfBirth: z
            .date()
            .refine((date) => date instanceof Date, {
                message: "Date of birth is required",
            }),

        gender: z.enum(["male", "female"], {
            message: "Please select gender",
        }),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Must contain uppercase letter")
            .regex(/[a-z]/, "Must contain lowercase letter")
            .regex(/[0-9]/, "Must contain number"),

        rePassword: z.string(),
    })
    .refine((data) => data.password === data.rePassword, {
        message: "Passwords do not match",
        path: ["rePassword"],
    });