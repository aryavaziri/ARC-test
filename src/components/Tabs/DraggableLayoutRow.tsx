import { useDrag, useDrop } from "react-dnd";
import { memo, useRef } from "react";
import Input from "../UI/Input";
import { IoCloseSharp } from "react-icons/io5";
import Select from 'react-select';
import { Controller } from "react-hook-form";

const type = "LAYOUT_ROW";

type Layout = {
  label: string;
  route: string;
  layoutId: string;
};

interface DraggableLayoutRowProps {
  field: Layout & { id: string }; // id is added by RHF
  index: number;
  move: (from: number, to: number) => void;
  remove: (index: number) => void;
  register: any;
  control: any;
  errors?: any;
  layoutOptions: { value: string; label: string }[];
}

export const DraggableLayoutRow: React.FC<DraggableLayoutRowProps> = memo(function DraggableLayoutRow({
  index,
  field,
  move,
  register,
  control,
  errors,
  remove,
  layoutOptions,
}) {
  const ref = useRef<HTMLTableRowElement>(null);

  const [, drop] = useDrop({
    accept: type,
    hover(item: any) {
      if (item.index !== index) {
        move(item.index, index);
        item.index = index;
      }
    },
  });

  const [, drag] = useDrag({
    type,
    item: { index },
  });

  drag(drop(ref));

  return (
    <tr ref={ref} className="cursor-move">
      <td className="p-2">{index + 1}</td>

      <td className="p-2">
        <Input
          name={`layouts.${index}.label`}
          register={register}
          error={errors?.[index]?.label}
          style={1}
          label=""
        />
      </td>

      <td className="p-2">
        <Input
          name={`layouts.${index}.route`}
          register={register}
          error={errors?.[index]?.route}
          style={1}
          label=""
        />
      </td>

      <td className="p-2 min-w-[200px]">
        <Controller
          name={`layouts.${index}.layoutId`}
          control={control}
          rules={{ required: "Layout is required" }}
          render={({ field: selectField }) => (
            <Select
              {...selectField}
              options={layoutOptions}
              value={layoutOptions.find(option => option.value === selectField.value) || null}
              onChange={(val) => selectField.onChange(val?.value)}
              placeholder="Choose layout..."
              menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
              styles={{
                menuPortal: base => ({ ...base, zIndex: 9999 }),
              }}
              className="text-sm"
            />
          )}
        />
        {errors?.[index]?.layoutId && (
          <p className="text-red-500 text-xs mt-1">{errors[index].layoutId.message}</p>
        )}
      </td>

      <td className="p-2 text-center">
        <button
          type="button"
          onClick={() => remove(index)}
          className="btn-icon text-red-500"
        >
          <IoCloseSharp />
        </button>
      </td>
    </tr>
  );
});
