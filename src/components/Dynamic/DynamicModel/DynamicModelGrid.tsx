'use client'

import { useDynamicModel } from "@/store/hooks/dynamicModelsHooks"
import Input from "@/components/UI/Input"
import { dynamicModelSchema, TDynamicModel } from "@/types/dynamicModel"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect } from "react"


const schema = dynamicModelSchema.partial({ id: true });
type FormValues = z.infer<typeof schema>;

const DynamicModelGrid: React.FC = () => {
  const { refetch, models, addNewItem, setSelectedModel, selectedModel, getData } = useDynamicModel();
  const handleClick = async (model: TDynamicModel) => {
    setSelectedModel(model)
  }
  useEffect(() => {
    selectedModel && getData()
  }, [selectedModel]);

  useEffect(() => { refetch() }, []);

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
      reset({name:""}); 
    } catch (err) {
      console.error("Add model failed:", err);
    }
  };

  return (
    <div className="w-[400px] con overflow-x-auto">
      <table className="my-table whitespace-nowrap">
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
              className={`cursor-pointer ${selectedModel?.id === model.id ? 'row-selected' : ''}`}
              onClick={() => handleClick(model)}
            >
              <td>{model.id.slice(0, 8)}...</td>
              <td>{model.name}</td>
            </tr>
          ))}
          <tr className="after:border-none">
            <td className="p-0">
              <button
                className="my-1 btn btn-primary py-1 rounded w-full"
                onClick={handleSubmit(onSubmit)}
              >
                Add New
              </button>
            </td>
            <td className={`p-0 ${errors.name?`after:bg-rose-200`:`after:bg-lime-200`}`}>
              <Input
              className={`ml-2 mr-1 rounded`}
                register={register}
                name="name"
                label=""

              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DynamicModelGrid;
