import {z} from "zod";

export const loginSchema = z.object({
    email: z.string().email("Внесете валидна емаил адреса"),
    password: z.string().min(6, {
        message: 'Лозинката мора да содржи најмалку 6 карактери'
    })
})

export type LoginSchema = z.infer<typeof loginSchema>;