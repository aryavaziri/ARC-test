import Input from "@/components/UI/Input";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { TCreateField } from "@/types/dynamicModel";

type Props = {
  register: UseFormRegister<TCreateField>;
  errors: FieldErrors<TCreateField>;
};

export default function TextFieldInputs({ register, errors }: Props) {
  return (
    <Input
      name="maxLength"
      label="Max Length"
      type="number"
      register={register}
      error={"maxLength" in errors ? errors.maxLength : undefined}
      style={3}
    />
  );
}
