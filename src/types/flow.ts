import { z } from "zod";

export const flowSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, "Flow name is required"),
    script: z.string().min(1, "Flow script is required"),
    triggerType: z.enum(["beforeSubmit", "afterSubmit", "custom"]).optional().nullable(),
    targetType: z.enum(["model", "layout", "form", "field", "button"]).optional().nullable(),
    targetId: z.string().uuid().optional().nullable(),
    isActive: z.boolean().optional().default(true),
});

export type TFlow = z.infer<typeof flowSchema>;
