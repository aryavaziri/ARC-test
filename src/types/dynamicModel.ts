import { z } from 'zod';

// ENUM of all input types
export const fieldTypeEnum = z.enum(['text', 'number', 'date', 'checkbox', 'longText']);

// 🧩 Individual Field Type Schemas (from your model definitions)
export const textInputSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  maxLength: z.number().max(60),
  isRequired: z.boolean().optional(),
  type: z.literal('text'),
});

export const numberInputSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  min: z.number().nullable().optional(),
  max: z.number().nullable().optional(),
  isRequired: z.boolean().optional(),
  type: z.literal('number'),
});

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

// ✅ Unified Field Schema
export const fieldSchema = z.union([
  textInputSchema.extend({ type: z.string().optional() }),
  numberInputSchema.extend({ type: z.string().optional() }),
  dateInputSchema.extend({ type: z.string().optional() }),
  checkboxInputSchema.extend({ type: z.string().optional() }),
  longTextInputSchema.extend({ type: z.string().optional() }),
]);

export const fieldRecordSchema = z.object({
  id: z.string().uuid().optional(), // for updates or when fetching existing records
  modelId: z.string().uuid(),
  fieldId: z.string().uuid(),
  type: fieldTypeEnum,
  value: z.union([z.string(), z.number(), z.boolean(), z.date()]),
  label: z.string().optional(), // optional, since it's stored in the field too
});

// ✅ Record Entry
export const recordSchema = z.object({
  id: z.string().uuid(),
  recordName: z.string(),
  fields: z.array(fieldRecordSchema),
});

// ✅ Dynamic Model Structure
export const dynamicModelSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  layoutType: z.string().optional(),

  ModelTextInputs: z.array(textInputSchema).optional(),
  ModelNumberInputs: z.array(numberInputSchema).optional(),
  ModelDateInputs: z.array(dateInputSchema).optional(),
  ModelLongTextInputs: z.array(longTextInputSchema).optional(),
  ModelCheckboxInputs: z.array(checkboxInputSchema).optional(),
});

// ✅ Inferred Types
export type TField = z.infer<typeof fieldSchema>;
export type TRecord = z.infer<typeof fieldRecordSchema>;
// export type TRecord = z.infer<typeof recordSchema>;
export type TDynamicModel = z.infer<typeof dynamicModelSchema>;

export type FieldType = z.infer<typeof fieldTypeEnum>;
