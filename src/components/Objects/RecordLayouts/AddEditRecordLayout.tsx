'use client';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import Input from '@/components/UI/Input';
import { recordLayoutSchema, TRecordLayout } from '@/types/layouts';
import { zodResolver } from '@hookform/resolvers/zod';

type Props = {
  layoutId: string | null;
  mode: 'add' | 'edit';
  onClose: () => void;
};

const AddEditRecordLayout = ({ layoutId, mode, onClose }: Props) => {
  const { selectedModel, recordLayouts, createRecordLayout, updateRecordLayout } = useDynamicModel();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Pick<TRecordLayout, 'label' | 'isGrid' | 'allowAddingLineItems'>>({
    resolver: zodResolver(recordLayoutSchema.omit({ id: true, modelId: true, contentSchema: true })),
    defaultValues: { label: '', isGrid: false, allowAddingLineItems: false }
  });

  useEffect(() => {
    if (layoutId && mode === 'edit') {
      const layout = recordLayouts.find((l) => l.id === layoutId);
      if (layout) {
        reset({ label: layout.label, isGrid: layout.isGrid ?? false, allowAddingLineItems: layout.allowAddingLineItems ?? false });
      }
    } else {
      reset({ label: '', isGrid: false, allowAddingLineItems: false });
    }
  }, [layoutId, mode, recordLayouts, reset]);

  const onSubmit = async (data: { label: string; isGrid?: boolean }) => {
    if (!selectedModel) return;
    if (mode === 'add') {
      await createRecordLayout({ ...data, modelId: selectedModel.id });
    } else if (layoutId) {
      await updateRecordLayout({ id: layoutId, ...data });
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
      <Input
        name="isGrid"
        type='checkbox'
        label="Grid"
        register={register}
        error={errors.isGrid}
      />
      <Input
        name="allowAddingLineItems"
        type='checkbox'
        label="Allow Adding Line Items"
        register={register}
        error={errors.allowAddingLineItems}
      />
      <div className="flex justify-end gap-2 mt-6">
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

export default AddEditRecordLayout;
