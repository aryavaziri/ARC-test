'use client'

import { useForm, SubmitHandler } from "react-hook-form"
import Input from "@/components/UI/Input"
import { useDynamicModel } from "@/store/hooks/dynamicModelsHooks"
import { useEffect, useState } from "react"

type DynamicFormData = {
  [key: string]: string | number | boolean;
}

export default function DynamicRecordForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<DynamicFormData>()
  const { selectedModel, inputFields, records } = useDynamicModel()

  const [fieldHeaders, setFieldHeaders] = useState<{ id: string; label: string }[]>([])

  useEffect(() => {
    if (selectedModel) {
      const fields = inputFields?.map(field => ({
        id: field.id,
        label: field.label
      })) ?? []
      setFieldHeaders(fields)
    }
  }, [selectedModel, inputFields])

  const onSubmit: SubmitHandler<DynamicFormData> = (data) => {
    console.log("Submitted data:", data)
  }

  if (!selectedModel) return <p className="text-gray-500">Select a model to see records</p>

  return (
    <div className="p-6 bg-white rounded-xl border">
      <h2 className="text-xl font-semibold mb-4">Records for: {selectedModel.name}</h2>

      <div className="border rounded-xl overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">#</th>
              {fieldHeaders.map((field) => (
                <th key={field.id} className="p-2 border">{field.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              records.map((record, index) => (
                <tr key={record.id} className="border-t">
                  <td className="p-2 border text-center">{index + 1}</td>
                  {fieldHeaders.map((field) => {
                    const fieldValue = record.value ;
                    return <td key={field.id} className="p-2 border text-center">{String(fieldValue)}</td>
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={fieldHeaders.length + 1} className="p-4 text-center text-gray-500">
                  No records available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
