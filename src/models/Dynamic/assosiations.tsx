import { DynamicModel, LineItem } from "./DynamicModel";
import { ModelTextInput, ModelLongTextInput, ModelNumberInput, ModelDateInput, ModelCheckboxInput, ModelLookupInput } from "./M2M";
import { DateInputRecord, LongTextInputRecord, NumberInputRecord, TextInputRecord, CheckboxInputRecord, LookupInputRecord } from "./Records";
import { TextInput } from "./Fields/TextInput";
import { LongTextInput } from "./Fields/LongTextInput";
import { DateInput } from "./Fields/DateInput";
import { NumberInput } from "./Fields/NumberInput";
import { CheckboxInput } from "./Fields/CheckboxInput";
import { LookupInput } from "./Fields/LookupInput";

export const setAssociations = () => {

    DynamicModel.belongsToMany(TextInput, {
        through: ModelTextInput,
        foreignKey: "modelId",
        otherKey: "inputId",
        as: "ModelTextInputs",
        onDelete: "CASCADE",
    });

    DynamicModel.belongsToMany(LongTextInput, {
        through: ModelLongTextInput,
        foreignKey: "modelId",
        otherKey: "inputId",
        as: "ModelLongTextInputs",
        onDelete: "CASCADE",
    });

    DynamicModel.belongsToMany(NumberInput, {
        through: ModelNumberInput,
        foreignKey: "modelId",
        otherKey: "inputId",
        as: "ModelNumberInputs",
        onDelete: "CASCADE",
    });
    DynamicModel.belongsToMany(DateInput, {
        through: ModelDateInput,
        foreignKey: "modelId",
        otherKey: "inputId",
        as: "ModelDateInputs",
        onDelete: "CASCADE",
    });
    DynamicModel.belongsToMany(CheckboxInput, {
        through: ModelCheckboxInput,
        foreignKey: "modelId",
        otherKey: "inputId",
        as: "ModelCheckboxInputs",
        onDelete: "CASCADE",
    });
    DynamicModel.belongsToMany(LookupInput, {
        through: ModelLookupInput,
        foreignKey: "modelId",
        otherKey: "inputId",
        as: "ModelLookupInputs", 
        onDelete: "CASCADE",
    });


    ModelTextInput.belongsTo(TextInput, { foreignKey: "inputId", as: "input", onDelete: "CASCADE", });
    ModelLongTextInput.belongsTo(LongTextInput, { foreignKey: "inputId", as: "input", onDelete: "CASCADE", });
    ModelDateInput.belongsTo(DateInput, { foreignKey: "inputId", as: "input", onDelete: "CASCADE", });
    ModelNumberInput.belongsTo(NumberInput, { foreignKey: "inputId", as: "input", onDelete: "CASCADE", });
    ModelCheckboxInput.belongsTo(CheckboxInput, { foreignKey: "inputId", as: "input", onDelete: "CASCADE", });
    ModelLookupInput.belongsTo(LookupInput, { foreignKey: "inputId", as: "input", onDelete: "CASCADE", });

    LineItem.belongsTo(DynamicModel, { foreignKey: "inputId", as: "input", onDelete: "CASCADE", });



    TextInput.hasMany(TextInputRecord, {
        foreignKey: "fieldId",
        as: "records",
        onDelete: "CASCADE",
    });
    NumberInput.hasMany(NumberInputRecord, {
        foreignKey: "fieldId",
        as: "records",
        onDelete: "CASCADE",
    });
    DateInput.hasMany(DateInputRecord, {
        foreignKey: "fieldId",
        as: "records",
        onDelete: "CASCADE",
    });
    LongTextInput.hasMany(LongTextInputRecord, {
        foreignKey: "fieldId",
        as: "records",
        onDelete: "CASCADE",
    });
    CheckboxInput.hasMany(CheckboxInputRecord, {
        foreignKey: "fieldId",
        as: "records",
        onDelete: "CASCADE",
    });
    LookupInput.hasMany(LookupInputRecord, {
        foreignKey: "fieldId",
        as: "records",
        onDelete: "CASCADE",
    });


}