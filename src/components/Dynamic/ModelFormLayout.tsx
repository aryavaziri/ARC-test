'use client'
import React from 'react'
import { useForm, FormProvider, FieldValues, FieldError } from 'react-hook-form'
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks'
import DynamicItem from './DynamicItem'
import { DynamicInputType } from './DynamicItem'
import { TRecord } from '@/types/dynamicModel'
import Lookup from './LookupItem'

const ModelFormLayout = () => {
  const { selectedModel, addData } = useDynamicModel()

  const methods = useForm()
  const { register, handleSubmit, formState, control } = methods

  const fields = [
    ...(selectedModel?.ModelTextInputs?.map(f => ({ ...f, type: 'text' as DynamicInputType })) || []),
    ...(selectedModel?.ModelNumberInputs?.map(f => ({ ...f, type: 'number' as DynamicInputType })) || []),
    ...(selectedModel?.ModelLongTextInputs?.map(f => ({ ...f, type: 'longText' as DynamicInputType })) || []),
    ...(selectedModel?.ModelDateInputs?.map(f => ({ ...f, type: 'date' as DynamicInputType })) || []),
    ...(selectedModel?.ModelCheckboxInputs?.map(f => ({ ...f, type: 'checkbox' as DynamicInputType })) || []),
    ...(selectedModel?.ModelLookupInputs?.map(f => ({ ...f, type: 'lookup' as DynamicInputType })) || []),
  ]

  const onSubmit = async (formData: FieldValues) => {
    if (!selectedModel?.id) return

    const formatted: TRecord[] = fields.map(field => ({
      fieldId: field.id,
      value: formData[field.id],
      type: field.type,
      lineItemId: selectedModel.id,
      label: field.label
    }))

    console.log("📦 Submitting records:", { modelId: selectedModel.id, records: formatted })
    await addData({ modelId: selectedModel.id, records: formatted }) // 🔄 thunk call, must accept an array of TFieldRecord[]
  }
  if (!selectedModel?.id) return

  return (
    <div className={`flex flex-col gap-8`}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="con">
          <h2 className="text-xl font-semibold">{selectedModel?.name ?? 'Dynamic Form'}</h2>

          {fields.map((field) =>
            field.type === `lookup` ? <Lookup
              key={field.id}
              field={{
                id: field.id,
                label: field.label,
                type: field.type,
              }}
              control={control} // if you're using `react-hook-form` Controller
              error={formState.errors[field.id] as FieldError}
            /> :
              <DynamicItem<FieldValues>
                key={field.id}
                name={field.id || field.label}
                label={field.label}
                type={field.type}
                register={register}
                error={formState.errors[field.id] as FieldError}
                required={field.isRequired!!}
                style={3}
              />
          )}

          <button type="submit" className="btn btn-primary w-full">
            Add Line Item
          </button>
        </form>
      </FormProvider>
    </div>

  )
}

export default ModelFormLayout
