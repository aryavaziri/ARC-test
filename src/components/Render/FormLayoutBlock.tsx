'use client'

import { useForm, FieldValues, FieldError } from 'react-hook-form'
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks'
import { toast } from 'react-toastify'
import { useEffect, useMemo, useState } from 'react'
import { useFlow } from '@/store/hooks/flowsHooks'
import { TAttachment } from '@/types/layouts'
import RenderField from './RenderFieldNew'

interface Props {
  formLayoutId?: string;
  modelId?: string;
  layoutLabel?: string;
  onSave?: () => void;
  onCancel?: () => void;
  attachments?: TAttachment[];
  hasSubmit?: boolean;
}

const FormLayoutBlock: React.FC<Props> = ({ formLayoutId, modelId, layoutLabel, onSave, onCancel, attachments, hasSubmit = false }) => {
  const { models, allFields, formLayouts, addData } = useDynamicModel();
  const { runAndHandleFlow } = useFlow();
  const methods = useForm();
  const { handleSubmit } = methods;


  const formLayout = formLayoutId
    ? formLayouts.find(f => f.id === formLayoutId)
    : formLayouts.find(f => f.modelId === modelId);

  const submitButtons = attachments?.filter(att => att.type === 'button' && att.payload?.action === 'submit');
  const customButtons = attachments?.filter(att => att.type === 'button' && att.payload?.action === 'custom');

  const numberOfColumns = useMemo(() => {
    const maxCol = Math.max(0, ...(formLayout?.contentSchema ?? []).map(f => f.col ?? 0));
    return maxCol + 1;
  }, [formLayoutId, formLayout]);

  const fields = formLayout?.contentSchema?.map(item => {
    const field = allFields.find(f => f.id === item.fieldId);
    if (!field || !field.id) return null;
    return {
      ...field,
      lookupDetails: item.lookupDetails,
      attachments: formLayout?.attachments,
    };
  }).filter(Boolean) as (typeof allFields[0] & { lookupDetails?: any; attachment?: any })[];

  const groupedFields: ExtendedField[][] = useMemo(() => {
    if (!models) return [[]]
    const cols: ExtendedField[][] = Array.from({ length: numberOfColumns }, () => []);
    fields?.forEach(field => {
      const col = formLayout?.contentSchema?.find(i => i.fieldId === field.id)?.col ?? 0;
      cols[col]?.push(field);
    });
    return cols;
  }, [fields, formLayout, numberOfColumns, models]);

  const model = models.find(m => m.id === formLayout?.modelId);

  const buildInputPayload = () => {
    const formValues = methods.getValues();
    return fields.map(field => ({
      name: field.label,
      fieldId: field.id,
      value: formValues[field.id]
    }));
  };

  type ExtendedField = typeof allFields[number] & {
    lookupDetails?: any;
    attachments?: any;
  };


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

    setTimeout(() => {
      onSave?.();
      onCancel?.();
    }, 100); // Allow time for toast before unmount
  };

  const handleCustomSubmit = async (button: TAttachment) => {
    const { beforeSubmitScript, afterSubmitScript } = button.payload;

    try {
      if (beforeSubmitScript) {
        await runAndHandleFlow(beforeSubmitScript, {
          values: buildInputPayload()
        }, {
          methods,
          fields,
          label: "Before Submit Flow",
        });
      }

      await handleSubmit(onSubmit)();

      if (afterSubmitScript) {
        await runAndHandleFlow(afterSubmitScript, {
          values: buildInputPayload()
        }, {
          methods,
          fields,
          label: "After Submit Flow",
        });
      }

    } catch (err) {
      toast.error("Custom submission failed.");
      console.error("Custom submit error:", err);
    }
  };

  const handleCustomButton = async (button: TAttachment) => {
    const { customFlow } = button.payload;

    try {
      if (customFlow) {
        await runAndHandleFlow(customFlow, {
          values: buildInputPayload()
        }, {
          methods,
          fields,
          label: layoutLabel ?? "Custom Flow",
        });
      }

    } catch (err) {
      toast.error("Custom flow failed.");
      console.error("Custom flow error:", err);
    }
  };

  return (
    <div className="con">
      <div className="text-sm font-semibold text-muted-foreground mb-4">
        {model?.name} - {formLayout?.label}
      </div>
      <div className={`grid gap-12 ${`grid-cols-${numberOfColumns}`}`} >
        {groupedFields.map((colFields, colIdx) => {
          return (
            <div key={colIdx} className="flex flex-col gap-3">
              {colFields.map((field) => (
                <RenderField
                  key={field.id}
                  field={field}
                  formLayoutId={formLayout?.id}
                  fields={fields}
                  methods={methods}
                />
              ))}
            </div>
          )
        })}
      </div>

      <div className="pt-4 flex gap-4">
        {submitButtons?.map((btn, idx) => (
          <button
            key={idx}
            type="button"
            className="btn btn-primary mt-2"
            onClick={() => handleCustomSubmit(btn)}
          >
            {btn.payload.text || "Custom Submit"}
          </button>
        ))}
        {hasSubmit &&
          <button
            type="button"
            className="btn btn-primary mt-2"
            onClick={handleSubmit(onSubmit)}
          >Submit Submit</button>
        }
        {customButtons?.map((btn, idx) => (
          <button
            key={idx}
            type="button"
            className="btn btn-secondary mt-2"
            onClick={() => handleCustomButton(btn)}
          >
            {btn.payload.text || "Custom Action"}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FormLayoutBlock;
