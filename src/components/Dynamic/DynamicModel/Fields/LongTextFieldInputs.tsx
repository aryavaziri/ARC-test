import Input from "@/components/UI/Input";
import { TCreateField } from "@/types/dynamicModel";
import { useForm } from "react-hook-form";

type Props = {
  method: ReturnType<typeof useForm<TCreateField>>;
};

export default function LongTextFieldInputs({ method }: Props) {
  return (
    <Input
      name="maxLength"
      label="Max Length"
      type="number"
      register={method.register}
      error={"maxLength" in method.formState.errors ? method.formState.errors.maxLength : undefined}
      style={3}
    />
  );
}
