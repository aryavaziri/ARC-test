'use client'

import { useDynamicModel } from "@/store/hooks/dynamicModelsHooks"
import Input from "@/components/UI/Input"
import { dynamicModelSchema, TDynamicModel } from "@/types/dynamicModel"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect } from "react"

type Props = {
  // onSelectModel: (model: TDynamicModel) => void;
};

const schema = dynamicModelSchema.partial({ id: true });
type FormValues = z.infer<typeof schema>;

const DynamicModelGrid: React.FC<Props> = ({ }) => {
  const { models, addNewItem, setSelectedModel, selectedModel } = useDynamicModel();
  const handleClick = (model: TDynamicModel) => {
    // console.log(model)
    setSelectedModel(model)
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form errors:", errors);
    }
  }, [errors]);

  const onSubmit = async (data: FormValues) => {
    try {
      const result = await addNewItem(data);
      reset(); // clear input after success
    } catch (err) {
      console.error("Add model failed:", err);
    }
  };

  return (
    <div className="rounded-xl overflow-x-auto">
      <table className="w-min my-table whitespace-nowrap">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {models.map(model => (
            <tr
              key={model.id}
              // className="cursor-pointer hover:bg-gray-100"
              className={`cursor-pointer hover:bg-gray-100 ${selectedModel?.id === model.id ? 'row-selected' : ''}`}
              // onClick={() => onSelectModel(model)}
              onClick={() => handleClick(model)}
            >
              <td>{model.id.slice(0, 8)}...</td>
              <td>{model.name}</td>
            </tr>
          ))}
          <tr>
            <td className="p-0">
              <button
                className="btn btn-primary rounded-none w-full"
                onClick={handleSubmit(onSubmit)}
              >
                Add New
              </button>
            </td>
            <td className="p-0 bg-lime-200">
              <Input
                register={register}
                name="name"
                label=""
                // error={errors.name}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DynamicModelGrid;
