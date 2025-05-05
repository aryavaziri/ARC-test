import { number, z } from 'zod';
import { checkboxInputSchema, dateInputSchema, longTextInputSchema, lookupSchema, numberInputSchema, textInputSchema } from './dynamicModel';
import { IconName } from '@/store/slice/iconMap';

export const lookupSchemaInForms = lookupSchema.extend({
  searchModalColumns: z.array(z.string().uuid()).optional(),
  recordTableColumns: z.array(z.string().uuid()).optional(),
})


export const fieldSchemaInForms = z.discriminatedUnion("type", [
  textInputSchema,
  numberInputSchema,
  dateInputSchema,
  checkboxInputSchema,
  longTextInputSchema,
  lookupSchemaInForms,
]);

export const layoutSchema = z.object({
  label: z.string().min(1, "Layout label is required"),
  route: z.string().min(1, "Route is required"),
  layoutId: z.string().uuid(),
});

export const tabSchema = z.object({
  id: z.string().min(1, "ID is required"),
  label: z.string().min(1, "Tab label is required"),
  iconName: z.custom<IconName>((val) => typeof val === "string", { message: "Invalid icon name" }),
  layouts: z.array(layoutSchema).min(1, "At least one layout is required"),
});

export const VALID_ATTACHMENT_TYPES = ['script', 'flow', 'input', 'component', 'external', 'note', 'divider', 'spacer', `button`, `empty`, `field`] as const;

export const attachmentSchema = z.object({
  type: z.enum(VALID_ATTACHMENT_TYPES),
  payload: z.any(), // Consider refining per type
});

const sharedFields = z.object({
  attachments: z.array(attachmentSchema).optional(),
});

const droppedFormField = z.object({
  type: z.literal('form'),
  label: z.string(),
  index: z.number().int().nonnegative(),
  region: z.number().int().nonnegative(),
  formLayoutId: z.string(),
});

const droppedRecordField = z.object({
  type: z.literal('record'),
  label: z.string(),
  index: z.number().int().nonnegative(),
  region: z.number().int().nonnegative(),
  recordLayoutId: z.string(),
});

const droppedCustomField = z.object({
  id: z.string().optional(),
  type: z.literal('custom'),
  label: z.string(),
  index: z.number().int().nonnegative(),
  region: z.number().int().nonnegative(),
  customKey: z.string().min(1),
});

export const droppedFieldSchema = z.discriminatedUnion('type', [
  droppedFormField.merge(sharedFields),
  droppedRecordField.merge(sharedFields),
  droppedCustomField.merge(sharedFields),
]);

export const contentSchema = z.array(droppedFieldSchema);

export const pageLayoutSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  templateId: z.string(),
  contentSchema
})
export const createPageLayoutSchema = pageLayoutSchema.omit({ id: true });



export const formItemSchema = z.object({
  fieldId: z.string().uuid(),
  type: z.string(),
  order: z.number(),
  flowId: z.string().optional().nullable(),
  lookupDetails: z.object({
    lookupModelId: z.string().uuid(),
    searchFields: z.array(z.string()).optional(),
    fields: z.array(z.array(z.string())),
    isCustomStyle: z.boolean(),
    allowAddingRecord: z.boolean().optional(),
  }).optional(),
  col: z.number().int().nonnegative().optional(),
})

export const formLayoutSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  modelId: z.string().uuid(),
  numberOfColumns: z.number().int().min(1).optional().default(1),
  contentSchema: z.array(formItemSchema).optional(),
  attachments: z.array(attachmentSchema).optional()
})

export const recordItemSchema = z.object({
  fieldId: z.string().uuid(),
  type: z.string(),
  order: z.number(),
  lookupDetails: z.object({
    lookupModelId: z.string().uuid(),
    fields: z.array(z.array(z.string())),
  }).optional(),
})

export const recordLayoutSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  modelId: z.string().uuid(),
  isGrid: z.boolean().optional(),
  contentSchema: z.array(recordItemSchema).optional(),
  attachments: z.array(attachmentSchema).optional()
})



export type TFormItem = z.infer<typeof formItemSchema>;
export type TRecordItem = z.infer<typeof recordItemSchema>;
export type TTab = z.infer<typeof tabSchema>;
export type TFormLayout = z.infer<typeof formLayoutSchema>;
export type TRecordLayout = z.infer<typeof recordLayoutSchema>;

export type TAttachment = z.infer<typeof attachmentSchema>;
export type TAttachmentType = typeof VALID_ATTACHMENT_TYPES[number];

export type TContentSchema = z.infer<typeof contentSchema>;
export type TDroppedField = z.infer<typeof droppedFieldSchema>;
export type TCustomDroppedField = z.infer<typeof droppedCustomField>;

export type TPageLayout = z.infer<typeof pageLayoutSchema>;
export type TCreatePageLayout = z.infer<typeof createPageLayoutSchema>;
