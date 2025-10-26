import { z } from "zod";

export const contactSchema = z.object({
  username: z.string().min(1, "Корисничкото име е задолжително"),
  email: z.string().email("Внесете валидна е-маил адреса"),
  subject: z.string().min(1, "Предметот е задолжителен"),
  message: z.string().min(10, "Пораката мора да има најмалку 10 карактери"),
});

export type ContactSchema = z.infer<typeof contactSchema>;
