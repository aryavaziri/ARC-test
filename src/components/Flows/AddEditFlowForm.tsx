"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { flowSchema } from "@/types/flow";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../UI/Input";
import Select from "react-select";
import { useFlow } from "@/store/hooks/flowsHooks";
import { TFlow } from "@/types/flow";

const flowSchemaCreate = flowSchema.partial({ id: true });
export type FlowFormType = z.infer<typeof flowSchemaCreate>;

interface Props {
  onClose: () => void;
  defaultValues?: TFlow;
}

const triggerTypeOptions = [
  { label: "Before Submit", value: "beforeSubmit" },
  { label: "After Submit", value: "afterSubmit" },
  { label: "Custom", value: "custom" },
];

const targetTypeOptions = [
  { label: "Model", value: "model" },
  { label: "Layout", value: "layout" },
  { label: "Form", value: "form" },
  { label: "Field", value: "field" },
  { label: "Button", value: "button" },
];

const AddEditFlowForm = ({ onClose, defaultValues }: Props) => {
  const isEditMode = !!defaultValues?.id;
  const { createFlow, updateFlow } = useFlow();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
    watch,
  } = useForm<FlowFormType>({
    resolver: zodResolver(isEditMode ? flowSchema : flowSchemaCreate),
    defaultValues: defaultValues ?? {
      name: "",
      script: "",
      isActive: true,
    },
  });

  const onSubmit = async (values: FlowFormType) => {
    try {
      if (isEditMode && values.id) {
        await updateFlow(values as TFlow);
      } else {
        await createFlow(values);
      }
      onClose();
    } catch (err) {
      console.error("Flow Save Error:", err);
    }
  };

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    console.log(errors)
  }, [errors]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 min-w-[800px] p-8">
      <Input
        name="name"
        label="Flow Name"
        register={register}
        error={errors.name}
        required
        style={3}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>

          <label className="label">Trigger Type</label>

          <Controller
            name="triggerType"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={triggerTypeOptions}
                value={triggerTypeOptions.find(opt => opt.value === field.value)}
                onChange={(option) => field.onChange(option?.value)}
              />
            )}
          />
        </div>

        <div>
          <label className="label">Target Type</label>
          <Controller
            name="targetType"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={targetTypeOptions}
                value={targetTypeOptions.find(opt => opt.value === field.value)}
                onChange={(option) => field.onChange(option?.value)}
              />
            )}
          />
        </div>
      </div>

      <Input
        name="targetId"
        label="Target ID"
        register={register}
        error={errors.targetId}
        style={3}
      />

      {/* <Input
        name="script"
        label="Script"
        register={register}
        error={errors.script}
        required
        as="textarea"
        rows={5}
        style={3}
        placeholder={`e.g., if (record.total > 10000) return "Notify Admin";`}
      />
 */}

<div>
  <label className="label">Script</label>
  <textarea
    {...register("script")}
    rows={10}
    className="input w-full font-mono text-sm bg-neutral-900 text-green-200 border border-neutral-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
    placeholder={`e.g.,\nconst model = await _model.findByPk("id");\nreturn model.get({ plain: true });`}
  />
  {errors.script && (
    <p className="text-sm text-red-500 mt-1">{errors.script.message}</p>
  )}
</div>
      <Input
        name="isActive"
        label="Active"
        register={register}
        error={errors.isActive}
        type="checkbox"
      />

      <div className="flex justify-end gap-2 pt-4">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {isEditMode ? "Update Flow" : "Create Flow"}
        </button>
      </div>
    </form>
  );
};

export default AddEditFlowForm;
