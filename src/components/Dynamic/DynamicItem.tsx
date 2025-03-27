import { FieldError, FieldValues, Path, UseFormRegister } from 'react-hook-form'
import Input from '@/components/UI/Input'
import { FieldType } from '@/types/dynamicModel'

export type DynamicInputType = 'text' | 'number' | 'date' | 'longText' | 'checkbox'

export interface DynamicItemProps<T extends FieldValues> {
  name: Path<T>
  label: string
  type: FieldType
  register: UseFormRegister<T>
  error?: FieldError
  placeholder?: string
  required?: boolean
  style?: number
}

const DynamicItem = <T extends FieldValues>({
  name,
  label,
  type = 'text',
  register,
  error,
  placeholder,
  required = false,
  style = 1,
}: DynamicItemProps<T>) => {
  const isTextarea = type === 'longText'
  const isCheckbox = type === 'checkbox'

  return (
    <Input
      name={name}
      label={label}
      type={isTextarea ? 'text' : type}
      as={isTextarea ? 'textarea' : 'input'}
      register={register}
      error={error}
      placeholder={isCheckbox ? undefined : placeholder} // ⛔ checkbox shouldn't have placeholder
      required={required}
      style={style}
    />
  )
}

export default DynamicItem
