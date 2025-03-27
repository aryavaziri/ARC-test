'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import Input from '@/components/UI/Input';
import Select from 'react-select';
import { z } from 'zod';

import {
  textInputSchema,
  numberInputSchema,
  longTextInputSchema,
  checkboxInputSchema,
  dateInputSchema,
  TField,
} from '@/types/dynamicModel';
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';

const unifiedSchema = z.discriminatedUnion('type', [
  textInputSchema.partial({ id: true }).extend({ type: z.literal('text') }),
  numberInputSchema.partial({ id: true }).extend({ type: z.literal('number') }),
  longTextInputSchema.partial({ id: true }).extend({ type: z.literal('longText') }),
  checkboxInputSchema.partial({ id: true }).extend({ type: z.literal('checkbox') }),
  dateInputSchema.partial({ id: true }).extend({ type: z.literal('date') }),
]);

type TUnifiedSchema = z.infer<typeof unifiedSchema>;

type Props = {
  onClose: () => void;
  // field: TField; // already selected field
};

export default function EditDynamicField({ onClose }: Props) {
  const { selectedModel, selectedField } = useDynamicModel();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TUnifiedSchema>({
    resolver: zodResolver(unifiedSchema),
    defaultValues: selectedField as any,
  });

  useEffect(() => {
    reset(selectedField as any);
  }, [selectedField, reset]);

  const onSubmit = async (formData: TUnifiedSchema) => {
    console.log('Editing field:', formData);
    // TODO: call update thunk or mutation
    onClose();
  };

  const renderInputs = () => {
    switch (selectedField?.type) {
      case 'text':
        return (
          <>
            <Input
              name="maxLength"
              label="Max Length"
              type="number"
              register={register}
              error={'maxLength' in errors ? errors.maxLength : undefined}
              style={3}
            />
            <Input
              name="isRequired"
              label="Required"
              type="checkbox"
              register={register}
              error={'isRequired' in errors ? errors.isRequired : undefined}
              style={3}
            />
          </>
        );
      case 'number':
        return (
          <>
            <Input
              name="min"
              label="Min"
              type="number"
              register={register}
              error={'min' in errors ? errors.min : undefined}
              style={3}
            />
            <Input
              name="max"
              label="Max"
              type="number"
              register={register}
              error={'max' in errors ? errors.max : undefined}
              style={3}
            />
            <Input
              name="isRequired"
              label="Required"
              type="checkbox"
              register={register}
              error={'isRequired' in errors ? errors.isRequired : undefined}
              style={3}
            />
          </>
        );
      case 'longText':
      case 'checkbox':
        return (
          <Input
            name="isRequired"
            label="Required"
            type="checkbox"
            register={register}
            error={'isRequired' in errors ? errors.isRequired : undefined}
            style={3}
          />
        );
      case 'date':
        return (
          <>
            <Input
              name="startRange"
              label="Start Range"
              type="date"
              register={register}
              error={'startRange' in errors ? errors.startRange : undefined}
              style={3}
            />
            <Input
              name="endRange"
              label="End Range"
              type="date"
              register={register}
              error={'endRange' in errors ? errors.endRange : undefined}
              style={3}
            />
            <Input
              name="isRequired"
              label="Required"
              type="checkbox"
              register={register}
              error={'isRequired' in errors ? errors.isRequired : undefined}
              style={3}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-8">
      <Input
        name="label"
        label="Label"
        register={register}
        error={'label' in errors ? errors.label : undefined}
        style={3}
      />

      <Input
        name="type"
        label="Type"
        register={register}
        disabled // 👈 readonly type
        style={3}
      />

      {renderInputs()}

      <button type="submit" className="btn btn-primary mt-4">
        Save Changes
      </button>
    </form>
  );
}
