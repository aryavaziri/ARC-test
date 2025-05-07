import Input from "@/components/UI/Input";
import { TCreateField } from "@/types/dynamicModel";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

type Props = {
  method: ReturnType<typeof useForm<TCreateField>>;
};

export default function DateFieldInputs({ method }: Props) {
  const { register, control, formState: { errors } } = method;

  return (
    <>
      <div>
        <label htmlFor="" className={``}>Format</label>
        <Controller
          name="format"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={[
                { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
                { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
                { value: "DD-MM-YYYY", label: "DD-MM-YYYY" },
                { value: "HH:mm", label: "HH:mm" },
                { value: "YYYY-MM-DD HH:mm", label: "YYYY-MM-DD HH:mm" }
              ]}
              value={field.value ? { label: field.value, value: field.value } : undefined}
              onChange={(val) => field.onChange(val?.value)}
              isClearable
              classNamePrefix="react-select"
              menuPortalTarget={typeof window !== "undefined" ? document.body : null}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                menu: (base) => ({ ...base, position: "absolute" }),
              }}

            />
          )}
        />
      </div>
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
  );
}
