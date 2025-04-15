import {
    ModelTextInput, ModelNumberInput, ModelDateInput,
    ModelLongTextInput, ModelCheckboxInput, ModelLookupInput
} from "@/models/Dynamic/M2M";
import { TextInput, NumberInput, DateInput, LongTextInput, CheckboxInput, LookupInput } from "@/models/Dynamic/Fields";
import { FormLayout } from "@/models/Dynamic/DynamicModel";

export async function setStandardSchema(modelId: string) {
    const inputTypes = [
        { m2m: ModelTextInput, input: TextInput, type: "text" },
        { m2m: ModelNumberInput, input: NumberInput, type: "number" },
        { m2m: ModelDateInput, input: DateInput, type: "date" },
        { m2m: ModelLongTextInput, input: LongTextInput, type: "longText" },
        { m2m: ModelCheckboxInput, input: CheckboxInput, type: "checkbox" },
        { m2m: ModelLookupInput, input: LookupInput, type: "lookup" },
    ];

    let allFields: any[] = [];

    for (const { m2m, input, type } of inputTypes) {
        const joined = await m2m.findAll({ where: { modelId } });
        for (const relation of joined) {
            const field = await input.findByPk(relation.inputId);
            if (!field) continue;

            allFields.push({
                fieldId: field.id,
                type,
                order: relation.order ?? 0,
                lookupDetails: type === "lookup"
                    ? {
                        lookupModelId: (field as LookupInput).lookupModelId,
                        primaryField: (field as LookupInput).primaryFieldId,
                        fields: [], // or prepopulate if needed
                    }
                    : undefined,
            });
        }
    }

    // sort by order
    allFields.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const [layout] = await FormLayout.findOrCreate({
        where: { modelId, label: "Standard" },
        defaults: {
            contentSchema: allFields,
        },
    });

    if (layout) {
        layout.contentSchema = allFields;
        await layout.save();
    }

    return layout;
}
