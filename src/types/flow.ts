import { z } from "zod";

// Flow Metadata
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


// === FLOW RETURN FORMAT ===
// Shared base
const baseAction = z.object({
    action: z.enum(["setValue", "toast", "redirect"]),
    data: z.object({}).optional(),
});

// Action-Specific Schemas
const setValueReturnSchema = baseAction.extend({
    action: z.literal("setValue"),
    targetFieldId: z.string(),
    value: z.any(),
});

// const getValueReturnSchema = baseAction.extend({
//     action: z.literal("getValue"),
//     targetFieldId: z.string(),
// });

const toastReturnSchema = baseAction.extend({
    action: z.literal("toast"),
    message: z.string(),
});

const redirectReturnSchema = baseAction.extend({
    action: z.literal("redirect"),
    url: z.string(),
    queryParams: z.record(z.string(), z.string()).optional(),
});

// Unified Flow Return Schema
export const flowGeneralReturnSchema = z.discriminatedUnion("action", [
    setValueReturnSchema,
    // getValueReturnSchema,
    toastReturnSchema,
    redirectReturnSchema,
]);

// === Types ===
export type TFlowGeneralReturn = z.infer<typeof flowGeneralReturnSchema>;
export type TSetValueReturn = z.infer<typeof setValueReturnSchema>;
export type TToastReturn = z.infer<typeof toastReturnSchema>;
export type TRedirectReturn = z.infer<typeof redirectReturnSchema>;
export type TFlowActionType = TFlowGeneralReturn["action"];
