'use client';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import Input from '@/components/UI/Input';
import { formLayoutSchema, TFormLayout } from '@/types/layouts';
import { zodResolver } from '@hookform/resolvers/zod';

type Props = {
  layoutId: string | null;
  mode: 'add' | 'edit';
  onClose: () => void;
};

type LayoutFormInput = Pick<TFormLayout, 'label' | 'numberOfColumns'>;

const AddEditFormLayout = ({ layoutId, mode, onClose }: Props) => {
  const {
    selectedModel,
    formLayouts,
    getFormLayoutsData,
    createFormLayout,
    updateFormLayout
  } = useDynamicModel();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LayoutFormInput>({
    resolver: zodResolver(
      formLayoutSchema.omit({ id: true, modelId: true, contentSchema: true, attachments: true })
    ),
  });

  useEffect(() => {
    if (layoutId && mode === 'edit') {
      const layout = formLayouts.find((l) => l.id === layoutId);
      if (layout) {
        reset({ label: layout.label });
      }
    } else {
      reset({ label: '' });
    }
  }, [layoutId, mode, reset]);

  const onSubmit = async (data: LayoutFormInput) => {
    if (!selectedModel) return;

    if (mode === 'add') {
      await createFormLayout({
        ...data,
        modelId: selectedModel.id,
      });
    } else if (layoutId) {
      await updateFormLayout({
        id: layoutId,
        label: data.label,
        numberOfColumns: data.numberOfColumns
      });
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-9">
      <Input
        name="label"
        label="Label"
        register={register}
        error={errors.label}
        required
        style={3}
      />
      <label className="text-sm font-semibold">Number of Columns</label>
      <select
        {...register("numberOfColumns", { valueAsNumber: true })}
        className="border rounded px-2 py-1"
        defaultValue={1}
      >
        {[1, 2, 3, 4].map(n => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      <div className="flex justify-end gap-2 mt-4">
        <button type="button" onClick={onClose} className="btn btn-ghost">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {mode === 'add' ? 'Create Layout' : 'Update Layout'}
        </button>
      </div>
    </form>
  );
};

export default AddEditFormLayout;
