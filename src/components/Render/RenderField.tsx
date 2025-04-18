// utils/renderField.tsx
import { FieldError, FieldValues, UseFormRegister, Control } from 'react-hook-form'
import Lookup from './LookupItem';
import DynamicItem, { DynamicInputType } from './DynamicItem';
import { TFormItem } from '@/types/layouts';
// import DynamicItem, { DynamicInputType } from '@/components/Form/DynamicItem'
// import Lookup from '@/components/Form/LookupItem'
type RenderableField = {
  fieldId: string;
  label: string;
  type: string;
  isRequired?: boolean;
  lookupDetails?: any;
};

interface RenderFieldProps {
  field: TFormItem & { label?: string , isRequired?: boolean };
  control: Control<FieldValues>;
  register: UseFormRegister<FieldValues>;
  error: FieldError | undefined;
}

export const renderField = ({ field, control, register, error }: RenderFieldProps) => {
  return field.type === 'lookup' ? (
    <Lookup
      key={field.fieldId}
      field={field}
      control={control}
      error={error}
    />
  ) : (
    <DynamicItem<FieldValues>
      key={field.fieldId}
      name={field.fieldId}
      label={field.label??""}
      type={field.type as DynamicInputType}
      register={register}
      error={error}
      required={field.isRequired ?? false}
      style={3}
    />
  )
}
