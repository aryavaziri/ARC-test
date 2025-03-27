import { useState } from "react";
import { FieldError, UseFormRegister, FieldValues, Path } from "react-hook-form";

interface Props<T extends FieldValues> {
  label?: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError;
  type?: string;
  as?: "input" | "textarea";
  style?: number
  [x: string]: any;
}

const Input = <T extends FieldValues>({
  register,
  label,
  error,
  name,
  type = "text",
  as = "input",
  style = 1,
  ...rest
}: Props<T>) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const Component = as;
  const isNumberInput = type === "number";
  const isCheckbox = type === "checkbox";

  const capitalize = (text: string) => (!text ? "" : text.charAt(0).toUpperCase() + text.slice(1));

  const baseClass =
    `${error ? "bg-pink-500/30" : "bg-light"} w-full rounded px-2 py-1 border border-gray-400/70 text-dark focus:outline-none focus:ring-2 focus:ring-blue-400`;

  const renderInput = () => (
    <Component
      id={name}
      {...register(name, {
        required: rest?.required ? `${label || name} is required` : false,
        setValueAs: (value) => {
          if (isNumberInput) return value ? parseFloat(value) : undefined;
          return value === "" ? undefined : value;
        },
      })}
      {...rest}
      type={type}
      className={`${baseClass} ${rest.className || ""}`}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        setIsFocused(false);
        setHasValue(e.target.value.length > 0);
      }}
    />
  );

  return (
    <div className={`relative w-full ${isCheckbox ? "flex items-center gap-2" : `${style === 3 ? `flex-col` : `items-center`} flex whitespace-nowrap`}`}>
      {/* Checkbox style — shared across all styles */}
      {isCheckbox ? (
        <>
          <Component
            {...register(name, { setValueAs: (value) => !!value })}
            {...rest}
            type={type}
            className={`bg-light/80 border border-dark/30 scale-[1.5] ${rest.className || ""}`}
          />
          <label
            className={`transition-all duration-200 px-1 cursor-text whitespace-nowrap text-text`}
            htmlFor={name}
          >
            {capitalize(label ?? name)}{" "}
            {rest?.required && <span className="text-rose-600">*</span>}
          </label>
        </>
      ) :
        <>
          {style === 1 && (
            <label
              className={`absolute z-10 left-4 transition-all duration-200 bg-light px-1 cursor-text ${isFocused || hasValue ? "top-[-8px] text-sm text-gray-500 scale-90" : "top-3 text-gray-600"}`}
              htmlFor={name}
            >
              {capitalize(label ?? name)} {rest?.required && <span className="text-rose-600">*</span>}
            </label>
          )}

          {style === 2 && (
            <label className="font-semibold cursor-text w-48" htmlFor={name}>
              {capitalize(label ?? name)} {rest?.required && <span className="text-rose-600">*</span>}
            </label>
          )
          }
          {style === 3 && (
            <label htmlFor={name} >
              {capitalize(label ?? name)} {rest?.required && <span className="text-rose-600">*</span>}
            </label>
          )}

          {/* Input by style */}
          {renderInput()}
        </>}

      {/* Error Message */}
      {error && <div className="text-rose-700 mb-0 overflow-hidden">{error.message}</div>}
    </div>
  );
};

export default Input;
