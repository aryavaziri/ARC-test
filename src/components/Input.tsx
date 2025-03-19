import { useEffect, useState } from "react";
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

const Input = <T extends FieldValues>({
  register,
  label,
  error,
  name,
  type = "text",
  as = "input",
  ...rest
}: Props<T>) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    console.log(isFocused);
    console.log(hasValue);
  }, [isFocused, hasValue]);

  const Component = as;
  const isNumberInput = type === "number";
  const isCheckbox = type === "checkbox";

  function capitalizeFirstLetter(string: string) {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className={`relative w-full ${isCheckbox ? "flex items-center gap-2" : ""}`}>
      {isCheckbox && (
        <Component
          {...register(name, { setValueAs: (value) => !!value })}
          {...rest}
          type={type}
          className={`whitespace-nowrap bg-white/80 border border-dark/30 scale-[1.5] ${rest.className || ""
            }`}
        />
      )}

      {/* Label - Clickable & Transitions Smoothly */}
      {!isCheckbox ? (
        <label
          className={`absolute left-4 transition-all duration-200 bg-white px-1 cursor-text ${isFocused || hasValue
            ? "top-[-8px] text-sm text-gray-500 scale-90"
            : "top-3 text-gray-600"
            }`}
          htmlFor={name}
        >
          {capitalizeFirstLetter(label ?? name)}{" "}
          {rest?.required && <span className="text-rose-600">*</span>}
        </label>) : (
        <label
          className={`transition-all duration-200 bg-white px-1 cursor-text whitespace-nowrap text-gray-600`}
          htmlFor={name}
        >
          {capitalizeFirstLetter(label ?? name)}{" "}
          {rest?.required && <span className="text-rose-600">*</span>}
        </label>
      )}

      {!isCheckbox && (
        <Component
          id={name}
          {...register(name, {
            setValueAs: (value) => {
              if (isNumberInput) {
                return !value ? undefined : parseFloat(value);
              }
              return value === "" ? undefined : value;
            },
          })}
          {...rest}
          type={type}
          className={`${error ? `bg-pink-500/30` : `bg-white`
            } w-full rounded-lg px-2 py-[10px] border border-gray-400/70 focus:outline-none focus:ring-2 focus:ring-blue-400 ${rest.className || ""
            }`}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            setHasValue(e.target.value.length > 0);
          }}
        />
      )}

      {error && <div className="text-rose-700 mb-0 overflow-hidden">{error.message}</div>}
    </div>
  );
};

export default Input;
