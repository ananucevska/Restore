import z from "zod";

const passwordValidation = new RegExp(
    /^(?=.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;'"\/><.,])/
);

export const  registerSchema = z.object({
    name: z.string().min(1, "Името е задолжително"),
    email: z.string().email("Внесете валидна емаил адреса"),
    password: z.string().regex(passwordValidation, {
        message: 'Лозинката мора да содржи 1 мала буква, 1 голема буква, 1 број, 1 специјален карактер и да биде 6-10 карактери'
    }),
    confirmPassword: z.string(),
    city: z.string().min(1, "Градот е задолжителен"),
    municipality: z.string().optional(),
    neighborhood: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Лозинките не се совпаѓаат",
    path: ["confirmPassword"],
})

export type RegisterSchema = z.infer<typeof registerSchema>;