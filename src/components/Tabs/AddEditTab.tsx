"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { tabSchema } from "@/types/layouts";
import { useTab } from "@/store/hooks/tabsHooks";
import Input from "../UI/Input";
import IconSelect from "./IconSelect";
import { IoMdAdd } from "react-icons/io";
import { DraggableLayoutRow } from "./DraggableLayoutRow";
import Select from 'react-select';

const tabSchemaCreate = tabSchema.partial({ id: true });
export type TabFormType = z.infer<typeof tabSchemaCreate>;

interface Props {
  onClose: () => void;
  defaultValues?: TabFormType;
}

const AddEditTabForm = ({ onClose, defaultValues }: Props) => {
  const isEditMode = !!defaultValues?.id;
  const { createTab, updateTab, pageLayouts } = useTab();

  const [newLabel, setNewLabel] = useState("");
  const [newRoute, setNewRoute] = useState("");
  const [selectedLayoutOption, setSelectedLayoutOption] = useState<{ label: string; value: string } | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TabFormType>({
    resolver: zodResolver(isEditMode ? tabSchema : tabSchemaCreate),
    defaultValues: defaultValues ?? {
      label: "",
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "layouts",
  });

  const onSubmit = async (values: TabFormType) => {
    try {
      if (isEditMode && values.id) {
        await updateTab(values as any);
      } else {
        await createTab(values);
      }
      onClose();
    } catch (err) {
      console.error("Tab Save Error:", err);
    }
  };

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  const layoutOptions = pageLayouts.map((pl) => ({ value: pl.id, label: pl.name }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 min-w-[500px] p-8">
      <div className="flex items-end gap-2">
        <Input
          name="label"
          label="Tab Label"
          register={register}
          error={errors.label}
          required
          style={3}
        />
        <IconSelect control={control} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-dark">Links</label>
        <table className="my-table2 w-full">
          <thead>
            <tr>
              <th className="">#</th>
              <th className="">Label</th>
              <th className="">Route</th>
              <th className="">Layout</th>
              <th className=""></th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <DraggableLayoutRow
                key={field.id}
                index={index}
                field={field}
                register={register}
                control={control}
                errors={errors.layouts}
                remove={remove}
                move={move}
                layoutOptions={layoutOptions}
              />
            ))}

            <tr>
              <td className="p-2" />
              <td className="p-2">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Overview"
                  className="input w-full"
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={newRoute}
                  onChange={(e) => setNewRoute(e.target.value)}
                  placeholder="overview"
                  className="input w-full"
                />
              </td>
              <td className="p-2 min-w-[200px]">
                <Select
                  value={selectedLayoutOption}
                  onChange={setSelectedLayoutOption}
                  options={layoutOptions}
                  placeholder="Choose layout..."
                  className="text-sm"
                  menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                  styles={{
                    menuPortal: base => ({ ...base, zIndex: 9999 }),
                  }}
                />
              </td>
              <td className="center">
                <button
                  type="button"
                  className="btn-icon text-green-500"
                  disabled={!newLabel || !newRoute || !selectedLayoutOption}
                  onClick={() => {
                    if (!selectedLayoutOption) return;
                    append({
                      label: newLabel,
                      route: newRoute,
                      layoutId: selectedLayoutOption.value,
                    });
                    setNewLabel("");
                    setNewRoute("");
                    setSelectedLayoutOption(null);
                  }}
                >
                  <IoMdAdd />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {isEditMode ? "Update Tab" : "Create Tab"}
        </button>
      </div>
    </form>
  );
};

export default AddEditTabForm;
