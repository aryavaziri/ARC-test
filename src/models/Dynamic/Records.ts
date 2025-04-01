import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, Default } from "sequelize-typescript";
import { ModelCheckboxInput, ModelDateInput, ModelLongTextInput, ModelLookupInput, ModelNumberInput, ModelTextInput } from "./M2M";
import { LineItem } from "@/models/Dynamic/DynamicModel";

@Table({
    tableName: "TextInputRecord",
    timestamps: false,
})
export class TextInputRecord extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID })
    declare id: string;

    @ForeignKey(() => LineItem)
    @Column(DataType.UUID)
    declare lineItemId: string;

    @ForeignKey(() => ModelTextInput)
    @Column(DataType.UUID)
    declare fieldId: string;

    @Column(DataType.STRING)
    declare value: string;
}

@Table({
    tableName: "NumberInputRecord",
    timestamps: false,
})
export class NumberInputRecord extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID })
    declare id: string;

    @ForeignKey(() => LineItem)
    @Column(DataType.UUID)
    declare lineItemId: string;

    @ForeignKey(() => ModelNumberInput)
    @Column(DataType.UUID)
    declare fieldId: string;

    @Column(DataType.FLOAT)
    declare value: number;
}

@Table({
    tableName: "DateInputRecord",
    timestamps: false,
})
export class DateInputRecord extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID })
    declare id: string;

    @ForeignKey(() => LineItem)
    @Column(DataType.UUID)
    declare lineItemId: string;

    @ForeignKey(() => ModelDateInput)
    @Column(DataType.UUID)
    declare fieldId: string;

    @Column(DataType.DATE)
    declare value: Date;
}

@Table({
    tableName: "LongTextInputRecord",
    timestamps: false,
})
export class LongTextInputRecord extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID })
    declare id: string;

    @ForeignKey(() => LineItem)
    @Column(DataType.UUID)
    declare lineItemId: string;

    @ForeignKey(() => ModelLongTextInput)
    @Column(DataType.UUID)
    declare fieldId: string;

    @Column(DataType.TEXT)
    declare value: string;
}

@Table({
    tableName: "CheckboxRecord",
    timestamps: false,
})
export class CheckboxInputRecord extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID })
    declare id: string;

    @ForeignKey(() => LineItem)
    @Column(DataType.UUID)
    declare lineItemId: string;

    @ForeignKey(() => ModelCheckboxInput)
    @Column(DataType.UUID)
    declare fieldId: string;

    @Column(DataType.BOOLEAN)
    declare value: boolean;
}

@Table({
    tableName: "LookupRecord",
    timestamps: false,
})
export class LookupInputRecord extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @ForeignKey(() => LineItem)
    @Column(DataType.UUID)
    declare lineItemId: string;

    @ForeignKey(() => ModelLookupInput)
    @Column(DataType.UUID)
    declare fieldId: string;

    @Column(DataType.UUID)
    declare value: string;
}
