import { z } from "zod";

const fileSchema = z
    .instanceof(File)
    .refine((file) => file.size > 0, {
        message: "A file must be uploaded",
    }).transform((file) => ({
        ...file,
        preview: URL.createObjectURL(file),
    }));

const filesArraySchema = z
    .array(fileSchema)
    .min(1, "At least one image is required");

export const createProductSchema = z
    .object({
        name: z.string().min(1, "Name of product is required"),
        description: z
            .string()
            .min(1, "Description is required")
            .min(10, "Description must be at least 10 characters"),
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
        message: "At least one image is required",
        path: ["files"],
    });

export type CreateProductSchema = z.infer<typeof createProductSchema>;
