'use client'

import { useForm, FormProvider, FieldValues, FieldError } from 'react-hook-form'
import { useDynamicModel } from '@/store/hooks/dynamicModelsHooks'
import Lookup from './LookupItem'
import DynamicItem, { DynamicInputType } from './DynamicItem'
import { toast } from 'react-toastify'
import { useEffect } from 'react'

interface Props {
    formLayoutId?: string;
    modelId?: string;
    layoutLabel?: string;
    onSave?: () => void;
    onCancel?: () => void;
}
const FormLayoutBlock: React.FC<Props> = ({ formLayoutId, modelId, layoutLabel, onSave, onCancel }) => {
    const { models, allFields, formLayouts, addData } = useDynamicModel()
    const methods = useForm()
    const { register, handleSubmit, control, formState } = methods
    
    const formLayout = formLayoutId
    ? formLayouts.find(f => f.id === formLayoutId)
    : formLayouts.find(f => f.modelId === modelId);
    useEffect(() => {
        console.log(formLayout)
    }, [formLayout])
    
    if (!formLayout) {
        return (
          <div className="text-sm text-muted italic">
            Loading form layout...
          </div>
        );
      }
    const model = models.find(m => m.id === formLayout.modelId)
    const fields = formLayout.contentSchema?.map(item => {
        const field = allFields.find(f => f.id === item.fieldId);
        if (!field) return null;

        return {
            ...field,
            lookupDetails: item.lookupDetails, // include layout-specific config
        };
    }).filter(Boolean) as (typeof allFields[0] & { lookupDetails?: any })[];

    const onSubmit = async (formData: FieldValues) => {
        const formatted = fields.map(field => ({
            fieldId: field.id,
            value: formData[field.id],
            type: field.type,
            lineItemId: model?.id ?? '',
            label: field.label,
        }))

        console.log("🚀 Submitted:", formatted)
        // await addData({ modelId: model?.id ?? '', records: formatted })
        toast.promise(
            addData({ modelId: model?.id ?? '', records: formatted }),
            {
                pending: 'Saving data...',
                success: 'Record added successfully!',
                error: 'Failed to save record.',
            }
        );
        onSave?.();
        onCancel?.()
    }

    const renderField = (field: typeof fields[number]) => {
        return field.type === 'lookup' ? (
            <Lookup
                key={field.id}
                field={field}
                control={control}
                error={formState.errors[field.id] as FieldError}
            />
        ) : (
            <DynamicItem<FieldValues>
                key={field.id}
                name={field.id}
                label={field.label}
                type={field.type as DynamicInputType}
                register={register}
                error={formState.errors[field.id] as FieldError}
                required={field.isRequired ?? false}
                style={3}
            />
        )
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="con">
                <div className="text-sm font-semibold text-muted-foreground">
                    {model?.name} - {formLayout.label}
                </div>
                <div className="space-y-3">
                    {fields.map(renderField)}
                </div>
                <button type="submit" className="btn btn-primary w-full">Submit</button>
            </form>
        </FormProvider>
    )
}

export default FormLayoutBlock
