'use client';

import React, { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import { flattenModelFields } from '@/store/slice/dynamicModelSlice';

type LookupFormValues = {
  lookupModelId: string;
  primaryFieldId: string;
  searchModalColumns: string[];
};

type LookupOptionsProps = {
  lookupId: string;
  initialValues?: {
    primaryFieldId?: string;
    searchModalColumns?: string[];
  };
  onSave: (data: {
    primaryFieldId: string;
    searchModalColumns: string[];
  }) => void;
  onClose?: () => void;
};

const LookupOptions: React.FC<LookupOptionsProps> = ({ lookupId, onSave, onClose, initialValues }) => {
  const { models } = useDynamicModel();

  const { handleSubmit, control, setValue } = useForm<LookupFormValues>({
    defaultValues: {
      lookupModelId: lookupId,
      primaryFieldId: '',
      searchModalColumns: [],
    },
  });
  useEffect(() => {
    if (initialValues?.primaryFieldId) {
      setValue('primaryFieldId', initialValues.primaryFieldId);
    }
    if (initialValues?.searchModalColumns) {
      setValue('searchModalColumns', initialValues.searchModalColumns);
    }
  }, [initialValues, setValue]);

  const handleSave = handleSubmit((values) => {
    onSave({
      primaryFieldId: values.primaryFieldId,
      searchModalColumns: values.searchModalColumns,
    });
    if (onClose) onClose();
  });

  // Automatically set the lookup model ID on mount
  useEffect(() => {
    setValue('lookupModelId', lookupId);
  }, [lookupId, setValue]);

  // const lookupModelId = watch('lookupModelId');

  const selectedModel = useMemo(() => {
    const model = models.find((m) => m.id === lookupId);
    console.log(model)
    console.log(lookupId)
    return model
  }, [lookupId, models]);

  const fieldOptions = useMemo(() => {
    if (!selectedModel) return [];
    return flattenModelFields(selectedModel).map((f) => ({
      label: f.label,
      value: f.id,
    }));
  }, [selectedModel]);

  return (
    <div className="flex flex-col gap-4 p-8 min-w-[400px]">

      <div className="flex flex-col gap-1">
        <label>Primary Field</label>
        <Controller
          name="primaryFieldId"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={fieldOptions}
              value={fieldOptions.find((opt) => opt.value === field.value) || null}
              onChange={(option) => field.onChange(option?.value || '')}
              classNamePrefix="react-select"
              menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                menu: (base) => ({ ...base, position: 'absolute' }),
              }}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label>Search Modal Columns</label>
        <Controller
          name="searchModalColumns"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={fieldOptions}
              value={field.value?.map((id) =>
                fieldOptions.find((opt) => opt.value === id)
              ).filter(Boolean)}
              onChange={(options) =>
                field.onChange(options.map((opt) => opt?.value))
              }
              classNamePrefix="react-select"
              menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                menu: (base) => ({ ...base, position: 'absolute' }),
              }}
            />
          )}
        />
      </div>
      <div className="flex justify-end mt-4">
        <button onClick={handleSave} className="btn btn-primary">Save Options</button>
      </div>
    </div>
  );
};

export default LookupOptions;
