'use client';

import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import { flattenModelFields } from '@/store/slice/dynamicModelSlice';

type Props = {
  lookupId: string;
  initialFields?: string[];
  onSave: (fields: string[]) => void;
  onClose?: () => void;
};

const LookupGridColumn: React.FC<Props> = ({ lookupId, initialFields = [], onSave, onClose }) => {
  const { models } = useDynamicModel();

  const { control, setValue, handleSubmit } = useForm({
    defaultValues: {
      fields: initialFields,
    },
  });

  useEffect(() => {
    setValue('fields', initialFields);
  }, [initialFields, setValue]);

  const selectedModel = useMemo(() => models.find((m) => m.id === lookupId), [lookupId, models]);

  const fieldOptions = useMemo(() => {
    if (!selectedModel) return [];
    return flattenModelFields(selectedModel).map((f) => ({
      label: f.label,
      value: f.id,
    }));
  }, [selectedModel]);

  const handleSave = handleSubmit(({ fields }) => {
    onSave(fields);
    if (onClose) onClose();
  });

  return (
    <div className="flex flex-col gap-4 p-6 min-w-[400px]">
      <label className="text-sm font-medium">Grid Columns</label>
      <Controller
        name="fields"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            isMulti
            options={fieldOptions}
            value={field.value?.map((id: string) => fieldOptions.find(opt => opt.value === id)).filter(Boolean)}
            onChange={(options) => field.onChange(options.map(opt => opt?.value))}
            classNamePrefix="react-select"
            menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              menu: (base) => ({ ...base, position: 'absolute' }),
            }}
          />
        )}
      />
      <div className="flex justify-end pt-4">
        <button onClick={handleSave} className="btn btn-primary">Save Columns</button>
      </div>
    </div>
  );
};

export default LookupGridColumn;
