import Input from "@/components/UI/Input";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { TCreateField } from "@/types/dynamicModel";

type Props = {
  register: UseFormRegister<TCreateField>;
  errors: FieldErrors<TCreateField>;
};

export default function NumberFieldInputs({ register, errors }: Props) {
  return (
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
  );
}
