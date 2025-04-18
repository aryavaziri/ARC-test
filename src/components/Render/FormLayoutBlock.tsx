'use client'

import { useForm, FieldValues, FieldError } from 'react-hook-form'
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks'
import Lookup from './LookupItem'
import DynamicItem, { DynamicInputType } from './DynamicItem'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { useFlow } from '@/store/hooks/flowsHooks'
import { FaCode } from 'react-icons/fa'

interface Props {
  formLayoutId?: string;
  modelId?: string;
  layoutLabel?: string;
  onSave?: () => void;
  onCancel?: () => void;
}

const FormLayoutBlock: React.FC<Props> = ({ formLayoutId, modelId, layoutLabel, onSave, onCancel }) => {
  const { models, allFields, formLayouts, addData } = useDynamicModel();
  const { handleRunFlow } = useFlow();
  const formLayout = formLayoutId
    ? formLayouts.find(f => f.id === formLayoutId)
    : formLayouts.find(f => f.modelId === modelId);

  useEffect(() => { console.log(formLayout) }, [formLayout]);
  const methods = useForm();
  const { register, handleSubmit, control, formState } = methods

  if (!formLayout) { return <div className="text-sm text-muted italic">Loading form layout...</div> }

  const model = models.find(m => m.id === formLayout.modelId);
  const fields = formLayout.contentSchema?.map(item => {
    const field = allFields.find(f => f.id === item.fieldId);
    if (!field || !field.id) return null;

    return {
      ...field,
      lookupDetails: item.lookupDetails, // include layout-specific config
    };
  }).filter(Boolean) as (typeof allFields[0] & { lookupDetails?: any })[];

  useEffect(() => { console.log(fields) }, [fields]);

  const onSubmit = async (formData: FieldValues) => {
    const formatted = fields.map(field => ({
      fieldId: field.id,
      value: formData[field.id],
      type: field.type,
      lineItemId: model?.id ?? '',
      label: field.label,
    }));

    toast.promise(
      addData({ modelId: model?.id ?? '', records: formatted }),
      {
        pending: 'Saving data...',
        success: 'Record added successfully!',
        error: 'Failed to save record.',
      }
    );

    onSave?.();
    onCancel?.();
  };

  const renderField = (field: typeof fields[number]) => {
    if (!field.id) {
      console.warn("⚠️ Skipping field with missing ID", field);
      return null;
    }

    const name = field.id;
    const label = field.label ?? 'Unnamed Field';
    const layoutItem = formLayout.contentSchema?.find(item => item.fieldId === name);

    if (!layoutItem) {
      console.warn("⚠️ No matching layout item for field", field);
      return null;
    }

    return (
      <div key={name} className="space-x-2 flex items-end">
        {field.type === 'lookup' ? (
          <Lookup
            field={layoutItem}
            control={control}
            error={formState.errors[name] as FieldError}
          />
        ) : (
          <DynamicItem<FieldValues>
            name={name}
            label={label}
            type={field.type as DynamicInputType}
            register={register}
            error={formState.errors[name] as FieldError}
            required={field.isRequired ?? false}
            style={3}
          />
        )}

        {layoutItem.flowId && (
          <button
            type="button"
            className="btn-icon hover:bg-primary-200 mb-1"
            // onClick={() => handleRunFlow(layoutItem.flowId!, name)}
            onClick={async () => await handleRunFlow(layoutItem.flowId!, name, methods, fields)}
          >
            <FaCode />
          </button>
        )}
      </div>
    );

  };

  return (
    <div className="con">
      <div className="text-sm font-semibold text-muted-foreground mb-4">
        {model?.name} - {formLayout.label}
      </div>
      <div className="space-y-3">
        {fields.map(renderField)}
      </div>
      <div className="pt-4">
        <button
          type="button"
          className="btn btn-primary w-full"
          onClick={handleSubmit(onSubmit)}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default FormLayoutBlock;
