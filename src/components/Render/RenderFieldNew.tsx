'use client';

import { FieldError, FieldValues, UseFormReturn } from 'react-hook-form';
import Lookup from './LookupItem';
import DynamicItem, { DynamicInputType } from './DynamicItem';
import { FaCode } from 'react-icons/fa';
import { useEffect, useMemo } from 'react';
import { useFlow } from '@/store/hooks/flowsHooks';
import { TField, TLookupField } from '@/types/dynamicModel';
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import { useWatch } from 'react-hook-form';

interface RenderFieldProps {
  field: TField
  formLayoutId?: string;
  fields: TField[];
  methods: UseFormReturn<FieldValues>;
}

const RenderField: React.FC<RenderFieldProps> = ({
  field,
  formLayoutId,
  fields,
  methods,
}) => {

  const { runAndHandleFlow } = useFlow();
  const { control, register, formState: { errors }, watch, getValues } = methods;

  const name = field.id;
  const label = field.label ?? 'Unnamed Field';
  const rawError = errors[name];
  const error = (rawError && 'type' in rawError) ? rawError as FieldError : undefined;

  const { formLayouts, allFields } = useDynamicModel();
  const formLayout = formLayouts.find(f => f.id === formLayoutId);
  const layoutItem = formLayout?.contentSchema?.find(i => i.fieldId === field.id);

  const controllingFieldIds = (allFields.find(f => f.id === field.id && f.type == "lookup") as TLookupField)?.dependencies?.map(dep => dep.controllingFieldId).filter((id): id is string => typeof id === 'string') ?? [];

  const watchedValues = useWatch({ name: controllingFieldIds, control });


  const dependencyValues = useMemo(() => {
    const values: string[] = [];

    controllingFieldIds.forEach((id, index) => {
      const watched = watchedValues?.[index];
      if (typeof watched === 'string') {
        values.push(watched);
      } else if (Array.isArray(watched)) {
        values.push(...watched.filter((v) => typeof v === 'string'));
      }
    });
    return values;
  }, [watchedValues]);

  const updateLayoutItem = (fieldId: string, updates: Partial<any>) => {
    if (updates?.value !== undefined) {
      methods.setValue(fieldId, updates.value);
    }
  };

  if (!layoutItem) return null;

  return (
    <div key={name} className="space-x-2 flex items-end">
      {field.type === 'lookup' ? (
        <Lookup
          field={layoutItem}
          control={control}
          error={error}
          controllingValues={dependencyValues}
        />
      ) : (
        <DynamicItem<FieldValues>
          name={name}
          label={label}
          type={field.type as DynamicInputType}
          register={register}
          error={error}
          required={field.isRequired ?? false}
          style={3}
        />
      )}

      {!!layoutItem.flowId && (
        <button
          type="button"
          className="aspect-square h-8 btn-icon"
          onClick={async () => {
            if (!layoutItem?.flowId) return;
            await runAndHandleFlow(layoutItem.flowId, {
              values: fields.map(f => ({
                name: f.label,
                fieldId: f.id,
                value: getValues()[f.id],
              })),
              formLayoutId,
            }, {
              methods,
              fields,
              label: 'Custom Flow',
              updateLayoutItem,
            });
          }}
        >
          <FaCode />
        </button>
      )}
    </div>
  );
};

export default RenderField;
