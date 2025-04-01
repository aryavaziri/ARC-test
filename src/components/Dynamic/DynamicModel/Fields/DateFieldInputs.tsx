import Input from "@/components/UI/Input";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { TCreateField } from "@/types/dynamicModel";

type Props = {
  register: UseFormRegister<TCreateField>;
  errors: FieldErrors<TCreateField>;
};

export default function DateFieldInputs({ register, errors }: Props) {
  return (
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
  );
}
