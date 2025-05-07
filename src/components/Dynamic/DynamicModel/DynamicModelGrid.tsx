'use client'

import { useDynamicModel } from "@/store/hooks/dynamicModelsHooks"
import Input from "@/components/UI/Input"
import { dynamicModelSchema, TDynamicModel } from "@/types/dynamicModel"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect } from "react"
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


const schema = dynamicModelSchema.partial({ id: true });
type FormValues = z.infer<typeof schema>;

const DynamicModelGrid: React.FC = () => {
  const { models, addNewItem, setSelectedModel, selectedModel, getLineItems } = useDynamicModel();

  const router = useRouter();

  const handleClick = async (model: TDynamicModel) => {
    setSelectedModel(model)
    // router.push(`/settings/objectManager/objects`)
    router.push(`/settings/objectManager/${model.id}`)

  }
  useEffect(() => {
    selectedModel && getLineItems(selectedModel.id)
  }, [selectedModel]);

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
    await toast.promise(
      addNewItem(data),
      {
        pending: "Creating object...",
        success: "Object created successfully!",
        error: "Error creating object.",
      }
    );

    reset({ name: "" });
  };


  return (
    <div className={`con`} >
      <div className={`flex justify-between items-center`}>
        <p className="text-xl font-semibold mb-2">Objects</p>
        <p className="btn">Add New Object</p>
      </div>
      <div className="con !w-full">
        <table className="my-table whitespace-nowrap">
          <thead>
            <tr>
              <th className="w-[400px]">ID</th>
              <th>Name</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {models.map(model => (
              <tr
                key={model.id}
                className={`cursor-pointer ${selectedModel?.id === model.id ? 'row-selected' : ''}`}
                onClick={() => handleClick(model)}
              >
                <td>{model.id}</td>
                <td>{model.name}</td>
                <td>{model.layoutType ?? "-"}</td>
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
              <td className={`p-0 ${errors.name ? `after:bg-rose-200` : `after:bg-lime-200`}`}>
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
    </div>
  );
};

export default DynamicModelGrid;
