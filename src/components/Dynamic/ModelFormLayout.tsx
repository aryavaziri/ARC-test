'use client'

import React, { useEffect } from 'react'
import { useForm, FormProvider, FieldValues, FieldError } from 'react-hook-form'
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks'
import DynamicItem from './DynamicItem'
import { DynamicInputType } from './DynamicItem'
import DynamicRecordForm from './DynamicRecordForm'

const ModelFormLayout = () => {
  const { selectedModel } = useDynamicModel()

  const methods = useForm()
  const { register, handleSubmit, formState } = methods

  // useEffect(() => {
  //   console.log(formState)
  //   }, [formState])

  const onSubmit = (data: any) => {
    console.log('Form Data:', data)
  }

  const fields = [
    ...(selectedModel?.ModelTextInputs?.map(f => ({ ...f, type: 'text' as DynamicInputType })) || []),
    ...(selectedModel?.ModelNumberInputs?.map(f => ({ ...f, type: 'number' as DynamicInputType })) || []),
    ...(selectedModel?.ModelLongTextInputs?.map(f => ({ ...f, type: 'longText' as DynamicInputType })) || []),
    ...(selectedModel?.ModelDateInputs?.map(f => ({ ...f, type: 'date' as DynamicInputType })) || []),
    ...(selectedModel?.ModelCheckboxInputs?.map(f => ({ ...f, type: 'checkbox' as DynamicInputType })) || []),
  ]

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 bg-white rounded-xl border">
        <h2 className="text-xl font-semibold">{selectedModel?.name ?? 'Dynamic Form'}</h2>

        {fields.map((field) => {
          // if (field.type === 'checkbox') return null // skip unsupported for now

          return (
            <DynamicItem<FieldValues>
              key={field.id}
              name={field.id || field.label}
              label={field.label}
              type={field.type}
              register={register}
              error={formState.errors[field.id] as FieldError}
              required={field.isRequired}
              style={3}
            />
          )
        })}

        <button type="submit" className="mt-4 px-6 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600">
          Submit
        </button>
      </form>
      <DynamicRecordForm />
    </FormProvider>
  )
}

export default ModelFormLayout
