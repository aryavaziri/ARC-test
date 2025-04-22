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
  { label: "Form Event", value: "formEvent" },
  { label: "Field Interaction", value: "fieldEvent" },
  { label: "Manual Trigger", value: "manual" },
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
      script: flowScriptPlaceholder,
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 p-8">
      <div className="grid grid-cols-1 gap-4">
        <Input
          name="name"
          label="Flow Name"
          register={register}
          error={errors.name}
          required
          style={3}
        />

        {/* <div>
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
        </div> */}
      </div>

      <div>
        <label className="label">Script</label>
        <textarea
          {...register("script")}
          rows={20}
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


const flowScriptPlaceholder = `
// You have access to:
// - formValues: an object containing current form values (e.g. formValues.find(item => item.name === 'email').value)
// - params: query parameters from the URL (?userId=123)

// Example 1: Set a new value for a field
// return {
//   action: "setValue",
//   targetFieldId: "your-field-id-here", \\(e.g. formValues.find(item => item.name === 'email').id)
//   value: "Updated Value"
// };

// Example 2: Show a toast message
// return {
//   action: "toast",
//   message: \`Hello \${formValues["Name"] || "there"}!\`
// };

// Example 3: Redirect to another page
// return {
//   action: "redirect",
//   url: "/thank-you",
//   queryParams: { ref: params["userId"] ?? "guest" }
// };
`.trim();