// src/components/Dynamic/DynamicModel/Fields/AddEditDynamicField.tsx
'use client';

import { Control, FieldErrors, useForm, UseFormSetValue } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import Input from '@/components/UI/Input';
import { FieldType, TField, createFieldSchema, fieldSchema, TCreateField } from '@/types/dynamicModel';
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import TextFieldInputs from './TextFieldInputs';
import NumberFieldInputs from './NumberFieldInputs';
import LongTextFieldInputs from './LongTextFieldInputs';
import DateFieldInputs from './DateFieldInputs';
import LookupFieldInputs from './LookupFieldInputs';

const fieldTypes = [
  { label: 'Text', value: 'text' },
  { label: 'Number', value: 'number' },
  { label: 'Long Text', value: 'longText' },
  { label: 'Date', value: 'date' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'Lookup', value: 'lookup' },
] as const;

type Props = {
  onClose: () => void;
};
export default function AddEditDynamicField({ onClose }: Props) {
  const { selectedModel, addInputField, selectedField, models, editInputField } = useDynamicModel();
  const isEditMode = Boolean(selectedField);

  const [selectedInputType, setSelectedInputType] = useState<FieldType>(
    (selectedField?.type as FieldType) || 'text'
  );

  const method = useForm<TCreateField>({
    resolver: zodResolver(isEditMode ? fieldSchema : createFieldSchema)
  });

  const { register, handleSubmit, reset, control, watch, setValue, formState: { errors } } = method

  const onSubmit = async (formData: TCreateField | TField) => {
    if (!selectedModel?.id) return;

    const input = { ...formData, type: selectedInputType };
    const payload = { modelId: selectedModel.id, input: input as TCreateField | TField };
    console.log(payload)

    if (isEditMode) {
      await editInputField(payload as { modelId: string; input: TField });
    } else {
      await addInputField(payload as { modelId: string; input: TCreateField });
    }
    onClose();
  };

  useEffect(() => {
    if (selectedField) {
      const fieldType = selectedField.type as FieldType;
      reset({ ...selectedField, type: fieldType } as TCreateField);
      setSelectedInputType(fieldType);
    } else {
      reset({ label: '', type: selectedInputType } as Partial<TCreateField>);
    }
  }, [selectedField, reset, selectedInputType]);

  useEffect(() => {
    console.log(errors)
  }, [errors]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-8">
      {!isEditMode && (
        <div className="flex flex-col gap-1">
          <label className="font-medium">Select Field Type</label>
          <Select
            options={fieldTypes}
            value={fieldTypes.find(opt => opt.value === selectedInputType)}
            onChange={option => setSelectedInputType(option?.value as FieldType)}
            classNamePrefix="react-select"
            menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
            styles={{
              menuPortal: base => ({ ...base, zIndex: 9999 }),
              menu: base => ({ ...base, position: 'absolute' }),
            }}
          />
        </div>
      )}

      <Input
        name="label"
        label="Label"
        register={register}
        error={'label' in errors ? errors.label : undefined}
        style={3}
      />

      {selectedInputType === 'text' && <TextFieldInputs method={method} />}
      {selectedInputType === 'number' && <NumberFieldInputs method={method} />}
      {selectedInputType === 'longText' && <LongTextFieldInputs method={method} />}
      {selectedInputType === 'date' && <DateFieldInputs method={method} />}
      {/* {selectedInputType === 'checkbox' && <CheckboxFieldInputs register={register} errors={errors} />} */}
      {selectedInputType === 'lookup' && (
        <LookupFieldInputs
          control={control as Control<any>}
          errors={errors as FieldErrors<any>}
          models={models}
          watch={watch as (name: any) => any}
          setValue={setValue as UseFormSetValue<any>}
        />
      )}

      <Input
        name="isRequired"
        label="Required"
        type="checkbox"
        register={register}
        error={'isRequired' in errors ? errors.isRequired : undefined}
        style={3}
      />

      <Input
        name="isHidden"
        label="hidden"
        type="checkbox"
        register={register}
        error={'isHidden' in errors ? errors.isHidden : undefined}
        style={3}
      />

      <button type="submit" className="btn btn-primary mt-4">
        {isEditMode ? 'Update Field' : 'Add Field'}
      </button>
    </form>
  );
}