import { z } from 'zod';
import { checkboxInputSchema, dateInputSchema, fieldSchema, longTextInputSchema, lookupSchema, numberInputSchema, textInputSchema } from './dynamicModel';
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
  }).optional()
})

export const formLayoutSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  modelId: z.string().uuid(),
  contentSchema: z.array(formItemSchema).optional()
})

export const recordItemSchema = z.object({
  fieldId: z.string().uuid(),
  type: z.string(),
  order: z.number(),
  lookupDetails: z.object({
    lookupModelId: z.string().uuid(),
    fields: z.array(z.array(z.string())),
  }).optional()
})

export const recordLayoutSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  modelId: z.string().uuid(),
  isGrid: z.boolean().optional(),
  contentSchema: z.array(recordItemSchema).optional()
})

// export const tabSchema = z.object({
//   id: z.string().uuid(),
//   name: z.string(),
//   layoutType: z.string().nullable().optional(),
//   content: z.array(z.object({ form: formLayoutSchema, order: z.number().optional() })).optional(),
// });

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

// export const RegionKeyEnum = z.enum(['header', 'main', 'sidebar', 'footer', 'left', 'right', 'content']);

const droppedFormField = z.object({
  type: z.literal('form'),
  label: z.string(),
  index: z.number().int().nonnegative(),
  region: z.number().int().nonnegative(),
  formLayoutId: z.string(),
  recordLayoutId: z.undefined().optional(),
});

const droppedRecordField = z.object({
  type: z.literal('record'),
  label: z.string(),
  index: z.number().int().nonnegative(),
  region: z.number().int().nonnegative(),
  recordLayoutId: z.string(),
  formLayoutId: z.undefined().optional(),
});

export const droppedFieldSchema = z.discriminatedUnion('type', [droppedFormField, droppedRecordField]);


// export const droppedFieldSchema = z.object({
//   type:  z.enum(['record', 'form']),
//   index: z.number().int().nonnegative(),
//   region: RegionKeyEnum.optional(),
//   formLayoutId: z.string().uuid(),
//   recordLayoutId: z.string().uuid(),
//   label: z.string()
// });
export const contentSchema = z.array(droppedFieldSchema);

// export const contentSchema = z.object({
//   header: z.array(droppedFieldSchema),
//   main: z.array(droppedFieldSchema),
//   sidebar: z.array(droppedFieldSchema),
//   footer: z.array(droppedFieldSchema),
//   left: z.array(droppedFieldSchema),
//   right: z.array(droppedFieldSchema),
//   content: z.array(droppedFieldSchema)
// });

export const pageLayoutSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  templateId: z.string(),
  contentSchema
})
export const createPageLayoutSchema = pageLayoutSchema.omit({ id: true });

export type TFormItem = z.infer<typeof formItemSchema>;
export type TRecordItem = z.infer<typeof recordItemSchema>;
export type TTab = z.infer<typeof tabSchema>;
export type TFormLayout = z.infer<typeof formLayoutSchema>;
export type TRecordLayout = z.infer<typeof recordLayoutSchema>;


// export type TRegionKey = z.infer<typeof RegionKeyEnum>;
export type TContentSchema = z.infer<typeof contentSchema>;
export type TDroppedField = z.infer<typeof droppedFieldSchema>;

export type TPageLayout = z.infer<typeof pageLayoutSchema>;
export type TCreatePageLayout = z.infer<typeof createPageLayoutSchema>;
