import { z } from "zod";

const fileSchema = z
    .instanceof(File)
    .refine((file) => file.size > 0, {
        message: "Прикачувањето на слика е задолжително",
    }).transform((file) => ({
        ...file,
        preview: URL.createObjectURL(file),
    }));

const filesArraySchema = z
    .array(fileSchema)
    .min(1, "Прикачете најмалку една слика");

export const createProductSchema = z
    .object({
        name: z.string().min(1, "Името е задолжително"),
        description: z
            .string()
            .min(1, "Описот е задолжителен")
            .min(10, "Описот мора да има најмалку 10 карактери"),
        type: z.string().min(1, "Type is required"),
        pictureUrl: z.string().optional(),
        files: z.array(z.any()).optional(),
        hasFiles: z.boolean().optional(),
        condition: z.string().optional(),
        delivery: z.array(z.string()).optional(),
    })
    .refine((data) => {
        // Check if hasFiles is true (files are uploaded)
        if (data.hasFiles === true) {
            return true;
        }
        // Check if pictureUrl exists and is not empty
        if (data.pictureUrl && data.pictureUrl.trim().length > 0) {
            return true;
        }
        return false;
    }, {
        message: "Прикачете најмалку една слика",
        path: ["files"],
    });

export type CreateProductSchema = z.infer<typeof createProductSchema>;
