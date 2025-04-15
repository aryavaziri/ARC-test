'use client';

import { Controller, UseFormSetValue, Control, FieldErrors } from "react-hook-form";
import Select from "react-select";
import { TDynamicModel, TLookupField } from "@/types/dynamicModel";

type LookupFieldInputsProps = {
  control: Control<TLookupField>;
  errors: FieldErrors<TLookupField>;
  models: TDynamicModel[];
  watch: (name: keyof TLookupField) => any;
  setValue: UseFormSetValue<TLookupField>;
};

export default function LookupFieldInputs({ control, errors, models, setValue, watch }: LookupFieldInputsProps) {
  const lookupModelId = watch("lookupModelId");
  const selectedLookupModel = models.find((m) => m.id === lookupModelId);
  const allFields =
    selectedLookupModel
      ? [
        ...(selectedLookupModel.ModelTextInputs || []),
        ...(selectedLookupModel.ModelNumberInputs || []),
        ...(selectedLookupModel.ModelDateInputs || []),
        ...(selectedLookupModel.ModelCheckboxInputs || []),
        ...(selectedLookupModel.ModelLongTextInputs || []),
        ...(selectedLookupModel.ModelLookupInputs || []),
      ]
      : [];

  const fieldOptions = allFields.map((f) => ({
    label: f.label,
    value: f.id,
  }));

  return (
    <>
      {/* Lookup Model Selector */}
      <div className="flex flex-col gap-1">
        <label>Select Lookup Model</label>
        <Controller
          name="lookupModelId"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={models.map((m) => ({ label: m.name, value: m.id }))}
              value={models.map((m) => ({ label: m.name, value: m.id })).find((opt) => opt.value === field.value)}
              onChange={(option) => {
                field.onChange(option?.value);
                setValue("primaryFieldId", ""); // <- important: use empty string
                // setValue("searchModalColumns", []);
                // setValue("recordTableColumns", []);
              }}
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

      {/* Primary Field */}
      {lookupModelId && (
        <>
          <div className="flex flex-col gap-1">
            <label>Primary Field</label>
            <Controller
              name="primaryFieldId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={fieldOptions}
                  value={fieldOptions.find((opt) => opt.value === field.value) || null}
                  onChange={(option) => field.onChange(option?.value || "")}
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

          {/* Search Modal Columns */}
          {/* <div className="flex flex-col gap-1">
            <label>Search Modal Columns</label>
            <Controller
              name="searchModalColumns"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isMulti
                  options={fieldOptions}
                  // value={fieldOptions.filter((opt) => field.value?.includes(opt.value))}
                  value={field.value?.map((id: string) => fieldOptions.find(opt => opt.value === id)).filter(Boolean)}
                  onChange={(options) => field.onChange(options.map((opt) => opt?.value))}
                  classNamePrefix="react-select"
                  menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    menu: (base) => ({ ...base, position: "absolute" }),
                  }}
                />
              )}
            />
          </div> */}

          {/* Record Table Columns */}
          {/* <div className="flex flex-col gap-1">
            <label>Record Table Columns</label>
            <Controller
              name="recordTableColumns"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isMulti
                  options={fieldOptions}
                  value={field.value?.map((id: string) => fieldOptions.find(opt => opt.value === id)).filter(Boolean)}
                  // value={fieldOptions.filter((opt) => field.value?.includes(opt.value))}
                  onChange={(options) => field.onChange(options.map((opt) => opt?.value))}
                  classNamePrefix="react-select"
                  menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    menu: (base) => ({ ...base, position: "absolute" }),
                  }}
                />
              )}
            />
          </div> */}
        </>
      )}
    </>
  );
}
