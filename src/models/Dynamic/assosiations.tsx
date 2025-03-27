import { DynamicModel } from "./DynamicModel";
import { ModelTextInput, ModelLongTextInput, ModelNumberInput, ModelDateInput, ModelCheckboxInput } from "./M2M";
import { TextInput } from "./Fields/TextInput";
import { LongTextInput } from "./Fields/LongTextInput";
import { DateInput } from "./Fields/DateInput";
import { NumberInput } from "./Fields/NumberInput";
import { DateInputRecord, LongTextInputRecord, NumberInputRecord, TextInputRecord, CheckboxInputRecord } from "./Records";
import { CheckboxInput } from "./Fields/CheckboxInput";

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


    ModelTextInput.belongsTo(TextInput, { foreignKey: "inputId", as: "input", onDelete: "CASCADE", });
    ModelLongTextInput.belongsTo(LongTextInput, { foreignKey: "inputId", as: "input", onDelete: "CASCADE", });
    ModelDateInput.belongsTo(DateInput, { foreignKey: "inputId", as: "input", onDelete: "CASCADE", });
    ModelNumberInput.belongsTo(NumberInput, { foreignKey: "inputId", as: "input", onDelete: "CASCADE", });
    ModelCheckboxInput.belongsTo(CheckboxInput, { foreignKey: "inputId", as: "input", onDelete: "CASCADE", });


    ModelTextInput.hasMany(TextInputRecord, {
        foreignKey: "fieldId",
        as: "records",
        onDelete: "CASCADE",
    });
    ModelNumberInput.hasMany(NumberInputRecord, {
        foreignKey: "fieldId",
        as: "records",
        onDelete: "CASCADE",
    });
    ModelDateInput.hasMany(DateInputRecord, {
        foreignKey: "fieldId",
        as: "records",
        onDelete: "CASCADE",
    });
    ModelLongTextInput.hasMany(LongTextInputRecord, {
        foreignKey: "fieldId",
        as: "records",
        onDelete: "CASCADE",
    });
    ModelCheckboxInput.hasMany(CheckboxInputRecord , {
        foreignKey: "fieldId",
        as: "records",
        onDelete: "CASCADE",
    });


}