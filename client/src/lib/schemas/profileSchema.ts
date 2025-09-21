import z from "zod";

export const profileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    city: z.string().min(1, "City is required"),
    municipality: z.string().optional(),
    neighborhood: z.string().optional(),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
