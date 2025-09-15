import z from "zod";

const passwordValidation = new RegExp(
    /^(?=.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;'"\/><.,])/
);

export const  registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email(),
    password: z.string().regex(passwordValidation, {
        message: 'Password must contain 1 lowercase character, 1 uppercase character, 1 number, 1 special and be 6-10 characters'
    }),
    confirmPassword: z.string(),
    city: z.string().min(1, "City is required"),
    municipality: z.string().optional(),
    naselba: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export type RegisterSchema = z.infer<typeof registerSchema>;