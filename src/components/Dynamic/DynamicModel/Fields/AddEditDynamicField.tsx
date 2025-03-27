'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { z } from "zod";
import Select from "react-select";
import Input from "@/components/UI/Input";
import {
  textInputSchema,
  numberInputSchema,
  longTextInputSchema,
  checkboxInputSchema,
  dateInputSchema,
  FieldType
} from "@/types/dynamicModel";
import { useDynamicModel } from "@/store/hooks/dynamicModelsHooks";

const fieldTypes = [
  { label: "Text", value: "text" },
  { label: "Number", value: "number" },
  { label: "Long Text", value: "longText" },
  { label: "Date", value: "date" },
  { label: "Checkbox", value: "checkbox" },
] as const;

const unifiedSchema = z.discriminatedUnion("type", [
  textInputSchema.partial({ id: true }).extend({ type: z.literal("text") }),
  numberInputSchema.partial({ id: true }).extend({ type: z.literal("number") }),
  longTextInputSchema.partial({ id: true }).extend({ type: z.literal("longText") }),
  checkboxInputSchema.partial({ id: true }).extend({ type: z.literal("checkbox") }),
  dateInputSchema.partial({ id: true }).extend({ type: z.literal("date") }),
]);

type TUnifiedSchema = z.infer<typeof unifiedSchema>;

type Props = {
  onClose: () => void;
};

export default function AddEditDynamicField({ onClose }: Props) {
  const { selectedModel, addInputField, selectedField } = useDynamicModel();
  const isEditMode = Boolean(selectedField);

  // Set initial input type from field or default to 'text'
  const [selectedInputType, setSelectedInputType] = useState<FieldType>(
    (selectedField?.type as FieldType) || "text"
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TUnifiedSchema>({
    resolver: zodResolver(unifiedSchema),
  });

  // 🧠 Reset form when selectedField or type changes
  useEffect(() => {
    if (selectedField) {
      const fieldType = selectedField.type;
      if (
        fieldType === "text" ||
        fieldType === "number" ||
        fieldType === "date" ||
        fieldType === "checkbox" ||
        fieldType === "longText"
      ) {
        reset({
          ...selectedField,
          type: fieldType,
        } as TUnifiedSchema);
        setSelectedInputType(fieldType); // Update local state if needed
      }
    } else {
      reset({
        label: '',
        type: selectedInputType,
      } as Partial<TUnifiedSchema>);
    }
  }, [selectedField, reset, selectedInputType]);

  const onSubmit = async (formData: TUnifiedSchema) => {
    if (!selectedModel?.id) return;

    const payload = {
      modelId: selectedModel.id,
      input: formData,
    };

    if (isEditMode) {
      console.log("Edit mode", payload);
      // await editInputField(payload);
    } else {
      await addInputField(payload);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-8">
      {!isEditMode && (
        <div className="flex flex-col gap-1">
          <label className="font-medium">Select Field Type</label>
          <Select
            options={fieldTypes}
            value={fieldTypes.find(opt => opt.value === selectedInputType)}
            onChange={(option) => setSelectedInputType(option?.value as FieldType)}
            classNamePrefix="react-select"
            menuPortalTarget={typeof window !== "undefined" ? document.body : null}
            styles={{
              menuPortal: base => ({ ...base, zIndex: 9999 }),
              menu: base => ({ ...base, position: "absolute" }),
            }}
          />
        </div>
      )}

      <Input
        name="label"
        label="Label"
        register={register}
        error={"label" in errors ? errors.label : undefined}
        style={3}
      />

      {selectedInputType === "text" && (
        <Input
          name="maxLength"
          label="Max Length"
          type="number"
          register={register}
          error={"maxLength" in errors ? errors.maxLength : undefined}
          style={3}
        />
      )}

      {selectedInputType === "number" && (
        <>
          <Input
            name="min"
            label="Minimum"
            type="number"
            register={register}
            error={"min" in errors ? errors.min : undefined}
            style={3}
          />
          <Input
            name="max"
            label="Maximum"
            type="number"
            register={register}
            error={"max" in errors ? errors.max : undefined}
            style={3}
          />
        </>
      )}

      {selectedInputType === "date" && (
        <>
          <Input
            name="startRange"
            label="Start Range"
            type="date"
            register={register}
            error={"startRange" in errors ? errors.startRange : undefined}
            style={3}
          />
          <Input
            name="endRange"
            label="End Range"
            type="date"
            register={register}
            error={"endRange" in errors ? errors.endRange : undefined}
            style={3}
          />
        </>
      )}

      {selectedInputType === "longText" && (
        <Input
          name="maxLength"
          label="Max Length"
          type="number"
          register={register}
          error={"maxLength" in errors ? errors.maxLength : undefined}
          style={3}
        />
      )}

      <Input
        name="isRequired"
        label="Required"
        type="checkbox"
        register={register}
        error={"isRequired" in errors ? errors.isRequired : undefined}
        style={3}
      />

      <button type="submit" className="btn btn-primary mt-4">
        {isEditMode ? "Update Field" : "Add Field"}
      </button>
    </form>
  );
}
