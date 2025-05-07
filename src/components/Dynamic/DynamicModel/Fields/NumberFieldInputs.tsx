import Input from "@/components/UI/Input";
import { useForm, Controller } from "react-hook-form";
import { TCreateField } from "@/types/dynamicModel";
import Select from "react-select";

type Props = {
  method: ReturnType<typeof useForm<TCreateField>>;
};
const numberOptions = [
  { value: 'INTEGER', label: 'Integer' },
  { value: 'FLOAT', label: 'Float' },
  { value: 'PERCENTAGE', label: 'Percentage' },
  { value: 'NON_NEGATIVE', label: 'Non-Negative' },
  { value: 'CURRENCY_USD', label: 'Currency - $' },
  { value: 'CURRENCY_EUR', label: 'Currency - €' },
] as const;

type NumberType = typeof numberOptions[number]['value'];

export default function NumberFieldInputs({ method }: Props) {
  const { register, control, formState: { errors } } = method;

  return (
    <>
      <div>
        <label htmlFor="" className={``}>Format</label>
        <Controller
          name="numberType"
          control={control}
          render={({ field }) => (
            <Select<{ value: NumberType; label: string }>
              {...field}
              options={numberOptions}
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
  );
}
