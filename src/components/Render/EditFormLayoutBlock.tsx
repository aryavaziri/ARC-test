'use client';

import { useEffect, useState, useRef } from 'react';
import { useForm, FieldError } from 'react-hook-form';
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import { toast } from 'react-toastify';
// import { renderField } from './RenderField';
import RenderField from './RenderFieldNew';
import { TField } from '@/types/dynamicModel';

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

  const fields = layout?.contentSchema?.map((item) => {
    const baseField = allFields.find((f) => f.id === item.fieldId);
    if (!baseField) return null;

    return {
      ...baseField, // ✅ brings in id, type, and required props
      lookupDetails: item.lookupDetails, // optionally override or extend
      order: item.order ?? 0,
    };
  })
    .filter(Boolean) as TField[];


  const [initialValues, setInitialValues] = useState<Record<string, any> | null>(null);
  const hasInitialized = useRef(false); // ✅ prevents repeated resets

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
    if (initialValues && !hasInitialized.current) {
      reset(initialValues);
      hasInitialized.current = true;
    }
  }, [initialValues, reset]);

  const onSubmit = async (data: any) => {
    const currentLineItem = lineItem?.find((r) => r.id === recordId);
    if (!currentLineItem) {
      toast.error("Line item not found.");
      return;
    }

    const payload = fields.map((field) => ({
      id: currentLineItem.fields.find((f) => f.fieldId === field.id)?.id || "",
      fieldId: field.id,
      value: data[field.id],
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

  // if (!initialValues && lineItem?.length) {
  //   return <p className="text-muted text-sm">Loading record...</p>;
  // }

  const isFieldError = (e: any): e is FieldError =>
    !!e && typeof e === 'object' && 'type' in e;

  return (
    <div className="p-8 flex flex-col gap-4">
      {fields.filter((field) => !!field?.id).map((field) => {
        const error = formState.errors[field.id];
        return (
          <RenderField
            key={field.id}
            field={field}
            formLayoutId={layout?.id}
            fields={fields}
            methods={methods}
          />
        )
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
