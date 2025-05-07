'use client';
import { useForm, Controller } from "react-hook-form";
import { TLineItem, TLookupField } from "@/types/dynamicModel";
import { useDynamicModel } from "@/store/hooks/dynamicModelsHooks";
import Input from "../UI/Input";
import Select from "react-select";
import { IoIosAddCircle, IoIosAddCircleOutline } from "react-icons/io";
import { useEffect, useState } from "react";

interface Props {
  headers: {
    id: string;
    label: string;
    isLookup?: boolean;
    parentFieldId?: string;
  }[];
  onSubmitNewRecord?: (data: Partial<TLineItem>) => Promise<void>;
}

const RowLineItemAdd = ({ headers, onSubmitNewRecord }: Props) => {
  const { allFields, getLineItems } = useDynamicModel();
  const [lookupOptionsMap, setLookupOptionsMap] = useState<Record<string, {
    label: string;
    value: string;
    fullRecord: any;
    parentFieldId: string;
    lookupModelId: string;
  }[]>>({});
  const { register, handleSubmit, reset, control, formState } = useForm<Partial<TLineItem>>();
  const isDirty = !!Object.keys(formState.dirtyFields || {}).length;

  const fields = headers
    .map(header => header.isLookup ? allFields.find(field => field.id === header.parentFieldId) : allFields.find(field => field.id === header.id))
    .filter((f): f is typeof allFields[number] => !!f);


  useEffect(() => {
    const fetchAllLookups = async () => {
      const entries = await Promise.all(
        allFields
          .filter(f => f.type === "lookup")
          .filter(f => fields.some(field => field.id === f.id))
          .map(async (f) => {
            const records = await getLineItems(f.lookupModelId); // <-- You need this function
            const options = records.map((r: any) => ({
              label: r[f.primaryFieldId],
              value: r.id,
              fullRecord: r,
              parentFieldId: f.id,
              lookupModelId: f.lookupModelId
            }));
            return [f.id, options] as const;
          })
      );
      setLookupOptionsMap(Object.fromEntries(entries));
      console.log(Object.fromEntries(entries))
    };

    fetchAllLookups();
  }, [allFields]);

  const onSubmit = async (data: Partial<TLineItem>) => {
    if (onSubmitNewRecord) await onSubmitNewRecord(data);
    reset();
  };

  return (
    <tr>
      <td className={`w-1`}>
        {isDirty ? (
          <button
            className="w-8 flex justify-center items-center text-3xl text-primary cursor-pointer"
            onClick={handleSubmit(onSubmit)}
          >
            <IoIosAddCircle />
          </button>
        ) : (
          <div className="w-8 flex justify-center items-center text-3xl text-gray-400">
            <IoIosAddCircleOutline />
          </div>
        )}
      </td>

      {fields.map((field, idx) => {
        const header = headers.find(h => h.parentFieldId === field.id);
        // const parent = allFields.find(f => f.id === header?.parentFieldId);
        // const isLookup = parent?.type === "lookup";

        if (field.type === "lookup") {
          const options = field.type === "lookup" ? lookupOptionsMap[field.id] || [] : undefined;
          console.log(options)
          console.log(field)
          console.log(header)

          return (
            <td key={field.id + idx} className="p-1 min-w-[180px]">
              <Controller
                name={field.id as keyof TLineItem}
                control={control}
                render={({ field: ctrlField }) => (
                  <Select
                    {...ctrlField}
                    options={options}
                    getOptionLabel={(option) => {
                      console.log(option)
                      const primaryFieldId = (field as TLookupField).primaryFieldId;
                      return (
                        option.fullRecord?.fields?.find(
                          (f: { fieldId: string; value: string }) => f.fieldId === primaryFieldId
                        )?.value ?? "Unnamed"
                      );
                    }}
                    getOptionValue={(e) => e.value}
                    classNamePrefix="react-select"
                    placeholder="Select..."
                    menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                    isClearable
                    onChange={(option) => {
                      ctrlField.onChange(option?.value || "");
                      // Now you can access the parentFieldId or fullRecord here
                      // console.log("Selected record:", option?.fullRecord);
                      // console.log("Came from parentField:", option?.parentFieldId);
                    }}
                    value={options?.find((o) => o.value === ctrlField.value) || null}
                  />
                )}
              />
            </td>
          );
        }

        const inputType =
          field.type === "number"
            ? "number"
            : field.type === "date"
              ? "date"
              : field.type === "checkbox"
                ? "checkbox"
                : "text";

        const as = field.type === "longText" ? "textarea" : "input";

        return (
          <td key={field.id + idx} className="p-1 min-w-[180px]">
            <Input
              name={field.id as keyof TLineItem}
              type={inputType}
              as={as}
              label=""
              placeholder="Type..."
              register={register}
              className="rounded-xs hover:bg-white border-transparent shadow mx-auto"
            />
          </td>
        );
      })}
    </tr>
  );
};

export default RowLineItemAdd;
