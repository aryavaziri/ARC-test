import { z } from 'zod';

export const fieldTypeEnum = z.enum(['text', 'number', 'date', 'checkbox', 'longText', 'lookup']);

export const textInputSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  maxLength: z.number().max(255).optional().default(100),
  isRequired: z.boolean().optional().nullable(),
  type: z.literal('text'),
});

export const numberInputSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  min: z.number().nullable().optional(),
  max: z.number().nullable().optional(),
  numberType: z.string().optional().default('INTEGER'),
  isRequired: z.boolean().optional(),
  type: z.literal('number'),
});

export const lookupSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  isRequired: z.boolean().optional(),
  lookupModelId: z.string().uuid(),
  type: z.literal('lookup'),
  primaryFieldId: z.string().uuid(),
});

export const createLookupSchema = lookupSchema.omit({ id: true });

export const dateInputSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  startRange: z.string().nullable().optional(), // You may use .date() if you transform later
  endRange: z.string().nullable().optional(),
  isRequired: z.boolean().optional(),
  type: z.literal('date'),
});

export const checkboxInputSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  isRequired: z.boolean().optional(),
  type: z.literal('checkbox'),
});

export const longTextInputSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  maxLength: z.number().max(10000),
  isRequired: z.boolean().optional(),
  type: z.literal('longText'),
});

export const fieldSchema = z.discriminatedUnion("type", [
  textInputSchema,
  numberInputSchema,
  dateInputSchema,
  checkboxInputSchema,
  longTextInputSchema,
  lookupSchema,
]);

export const createFieldSchema = z.discriminatedUnion("type", [
  textInputSchema.omit({ id: true }),
  numberInputSchema.omit({ id: true }),
  dateInputSchema.omit({ id: true }),
  checkboxInputSchema.omit({ id: true }),
  longTextInputSchema.omit({ id: true }),
  lookupSchema.omit({ id: true }),
]);

export const fieldRecordSchema = z.object({
  id: z.string().uuid().optional(), // for updates or when fetching existing records
  lineItemId: z.string().uuid(),
  fieldId: z.string().uuid(),
  type: fieldTypeEnum,
  value: z.union([z.string(), z.number(), z.boolean(), z.date()]),
  label: z.string().optional(), // optional, since it's stored in the field too
});

export const recordSchema = z.object({
  id: z.string().uuid(),
  // recordName: z.string(),
  fields: z.array(fieldRecordSchema),
});

export const dynamicModelSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable().optional(),
  layoutType: z.string().nullable().optional(),

  ModelTextInputs: z.array(textInputSchema).optional(),
  ModelLookupInputs: z.array(lookupSchema).optional(),
  ModelNumberInputs: z.array(numberInputSchema).optional(),
  ModelDateInputs: z.array(dateInputSchema).optional(),
  ModelLongTextInputs: z.array(longTextInputSchema).optional(),
  ModelCheckboxInputs: z.array(checkboxInputSchema).optional(),
});

export type TField = z.infer<typeof fieldSchema>;
export type TCreateField = z.infer<typeof createFieldSchema>;
export type TRecord = z.infer<typeof fieldRecordSchema>;
export type TLineItem = z.infer<typeof recordSchema>;
export type TDynamicModel = z.infer<typeof dynamicModelSchema>;

export type FieldType = z.infer<typeof fieldTypeEnum>;

export type TLookupField = z.infer<typeof createLookupSchema>;