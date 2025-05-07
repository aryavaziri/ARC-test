import { z } from 'zod';

export const dependencySchema = z.object({
  id: z.string().uuid().optional(),
  referenceFieldId: z.string().uuid({ message: "referenceFieldId must be a valid UUID" }),
  dependantFieldId: z.string().uuid({ message: "referenceFieldId must be a valid UUID" }),
  controllingFieldId: z.string().uuid().optional().nullable(),
  referenceLineItemIds: z.array(z.string().uuid()).optional(),
});

export const fieldTypeEnum = z.enum(['text', 'number', 'date', 'checkbox', 'longText', 'lookup']);

export const baseInputSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  isRequired: z.boolean().optional().nullable(),
  isHidden: z.boolean().optional().nullable(),
});

export const textInputSchema = baseInputSchema.extend({
  type: z.literal('text'),
  maxLength: z.number().max(255).optional().default(100),
});

export const numberInputSchema = baseInputSchema.extend({
  type: z.literal('number'),
  min: z.number().nullable().optional(),
  max: z.number().nullable().optional(),
  numberType: z.enum(['INTEGER', 'FLOAT', 'PERCENTAGE', 'NON_NEGATIVE', 'CURRENCY_USD', 'CURRENCY_EUR']).optional().nullable().default('INTEGER'),
});

export const dateInputSchema = baseInputSchema.extend({
  type: z.literal('date'),
  format: z.enum(['YYYY-MM-DD', 'MM/DD/YYYY', 'DD-MM-YYYY', 'HH:mm', 'YYYY-MM-DD HH:mm', 'MMM D, YYYY', 'dddd, MMMM D']).optional().nullable().default('DD-MM-YYYY'),
  startRange: z.string().nullable().optional(),
  endRange: z.string().nullable().optional(),
});

export const lookupSchema = baseInputSchema.extend({
  type: z.literal('lookup'),
  lookupModelId: z.string().uuid(),
  primaryFieldId: z.string().uuid(),
  dependencies: z.array(dependencySchema).optional()
});

export const checkboxInputSchema = baseInputSchema.extend({
  type: z.literal('checkbox'),
});

export const longTextInputSchema = baseInputSchema.extend({
  type: z.literal('longText'),
  maxLength: z.number().max(10000),
});

export const createLookupSchema = lookupSchema.omit({ id: true });

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
  modelId: z.string(),
  fields: z.array(fieldRecordSchema),
});

export const dynamicModelSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable().optional(),
  layoutType: z.string().nullable().optional(),
  showInConfiguration: z.boolean().nullable().optional(),

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
export type TDependency = z.infer<typeof dependencySchema>;
