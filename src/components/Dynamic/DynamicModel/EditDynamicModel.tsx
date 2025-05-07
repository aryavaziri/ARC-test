'use client'
import React, { useEffect } from 'react'
import Input from "@/components/UI/Input";
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';

const dynamicModelEditSchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  description: z.string().nullable().optional(),
  layoutType: z.string().nullable().optional(),
  showInConfiguration: z.boolean().nullable().optional(),
})
type TDynamicModel = z.infer<typeof dynamicModelEditSchema>
interface Props {
  onClose: () => void;
}

const EditDynamicModel: React.FC<Props> = ({ onClose }) => {
  const { selectedModel, editItem } = useDynamicModel();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TDynamicModel>({
    resolver: zodResolver(dynamicModelEditSchema),
  });

  useEffect(() => {
    console.log(selectedModel)
    if (selectedModel) {
      reset(selectedModel);
    }
  }, [selectedModel, onClose]);

  useEffect(() => {
    console.log(errors)
  }, [errors]);


  const onSubmit = async (formData: TDynamicModel) => {
    console.log(formData)
    await toast.promise(
      editItem(formData),
      {
        pending: "Editing object...",
        success: "Object edited successfully!",
        error: "Error editing object.",
      }
    );

    onClose();
  };


  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-8">

        <Input
          name="id"
          label="ID"
          register={register}
          style={3}
          disabled
        />

        <Input
          name="name"
          label="Name"
          register={register}
          error={errors.name}
          style={3}
        />

        <Input
          name="description"
          label="Description"
          register={register}
          error={errors.description}
          style={3}
        />

        <Input
          name="layoutType"
          label="Type"
          register={register}
          error={errors.layoutType}
          style={3}
        />

        <Input
          name="showInConfiguration"
          label="Show In Configuration"
          type='checkbox'
          register={register}
          error={errors.showInConfiguration}
          style={3}
        />

        <button type="submit" className="btn btn-primary mt-4">Save</button>
      </form>
    </div>
  )
}

export default EditDynamicModel