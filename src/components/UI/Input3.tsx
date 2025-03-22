import { FieldError, UseFormRegister, FieldValues, Path } from "react-hook-form";

interface Props<T extends FieldValues> {
  label?: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError;
  type?: string;
  as?: "input" | "textarea";
  [x: string]: any;
}

const Input = <T extends FieldValues>({ register, label, error, name, type = "text", as = "input", ...rest }: Props<T>) => {
  const Component = as;

  function capitalizeFirstLetter(string: string) {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const isNumberInput = type === "number";
  const isCheckbox = type === "checkbox";

  return (
    <div className={`relative w-full ${isCheckbox ? "flex items-center gap-2" : ""}`}>
      {isCheckbox && <Component {...register(name, { setValueAs: value => !!value })} {...rest} type={type} className={`bg-light/80 border border-dark/30 ml-3 scale-[1.5] ${rest.className || ""}`} />}
      <label className="" htmlFor={name}>
        {capitalizeFirstLetter(label ?? name)} {rest?.required && <span className="text-rose-600">*</span>}
      </label>
      {!isCheckbox && (
        <Component
          {...register(name, {
            setValueAs: value => {
              if (isNumberInput) {
                return !value ? undefined : parseFloat(value);
              }
              return value === "" ? undefined : value;
            },
          })}
          {...rest}
          type={type}
          className={`${error ? `bg-pink-500/30` : `bg-light`} w-full rounded px-2 py-[6px] border border-dark/30 ${rest.className || ""}`}
        />
      )}
      {error && <div className="text-rose-700 mb-0 overflow-hidden">{error.message}</div>}
    </div>
  );
};

export default Input;