// utils/renderField.tsx
import { FieldError, FieldValues, UseFormRegister, Control } from 'react-hook-form'
import Lookup from './LookupItem';
import DynamicItem, { DynamicInputType } from './DynamicItem';
// import DynamicItem, { DynamicInputType } from '@/components/Form/DynamicItem'
// import Lookup from '@/components/Form/LookupItem'

interface RenderFieldProps {
  field: any;
  control: Control<FieldValues>;
  register: UseFormRegister<FieldValues>;
  error: FieldError | undefined;
}

export const renderField = ({ field, control, register, error }: RenderFieldProps) => {
  return field.type === 'lookup' ? (
    <Lookup
      key={field.id}
      field={field}
      control={control}
      error={error}
    />
  ) : (
    <DynamicItem<FieldValues>
      key={field.id}
      name={field.id}
      label={field.label}
      type={field.type as DynamicInputType}
      register={register}
      error={error}
      required={field.isRequired ?? false}
      style={3}
    />
  )
}
