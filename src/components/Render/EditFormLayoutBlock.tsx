'use client';

import { useEffect, useState } from 'react';
import { useForm, FieldError } from 'react-hook-form';
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import { toast } from 'react-toastify';
import { renderField } from './RenderField';

interface Props {
  modelId: string;
  layoutLabel: string;
  recordId: string;
  onSave?: () => void;
  onCancel?: () => void;
}

const EditFormLayoutBlock = ({ modelId, layoutLabel, recordId, onSave, onCancel }: Props) => {
  const { formLayouts, allFields, lineItem, updateLineItem } = useDynamicModel();
  const methods = useForm();
  const { register, control, handleSubmit, reset, formState } = methods;

  const layout = formLayouts.find((l) => l.modelId === modelId && l.label === layoutLabel);

  const fields =
    layout?.contentSchema
      ?.map((item) => {
        const baseField = allFields.find((f) => f.id === item.fieldId);
        if (!baseField) return null;

        return {
          type: baseField.type,
          fieldId: baseField.id,
          label: baseField.label,
          isRequired: baseField.isRequired ?? false,
          order: item.order ?? 0,
          lookupDetails: item.lookupDetails,
        };
      })
      .filter(Boolean) as {
        type: string;
        fieldId: string;
        label?: string;
        isRequired?: boolean;
        order: number;
        lookupDetails?: {
          lookupModelId: string;
          fields: string[][];
          isCustomStyle: boolean;
          searchFields?: string[];
        };
      }[];


  const [initialValues, setInitialValues] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const record = lineItem?.find((r) => r.id === recordId);
    if (!record) return;

    const values = record.fields.reduce((acc, field) => {
      acc[field.fieldId] = field.value;
      return acc;
    }, {} as Record<string, any>);

    setInitialValues(values);
  }, [recordId, lineItem]);

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const onSubmit = async (data: any) => {
    const currentLineItem = lineItem?.find((r) => r.id === recordId);
    if (!currentLineItem) {
      toast.error("Line item not found.");
      return;
    }

    const payload = fields.map((field) => ({
      id: currentLineItem.fields.find((f) => f.fieldId === field.fieldId)?.id || "",
      fieldId: field.fieldId,
      value: data[field.fieldId],
      type: field.type,
      label: field.label,
    }));

    toast.promise(
      updateLineItem({
        modelId,
        lineItemId: currentLineItem.id,
        records: payload,
      }),
      {
        pending: "Updating...",
        success: "Updated successfully!",
        error: "Update failed.",
      }
    );

    onSave?.();
  };

  if (!initialValues && lineItem?.length) {
    return <p className="text-muted text-sm">Loading record...</p>;
  }

  const isFieldError = (e: any): e is FieldError =>
    !!e && typeof e === 'object' && 'type' in e;

  return (
    <div className="con space-y-4">
      {fields.filter((field) => !!field?.fieldId).map((field) => {
        const error = formState.errors[field.fieldId];
        return renderField({
          field,
          control,
          register,
          error: isFieldError(error) ? error : undefined,
        });
      })}

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
        <button type="button" onClick={handleSubmit(onSubmit)} className="btn btn-primary">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditFormLayoutBlock;
