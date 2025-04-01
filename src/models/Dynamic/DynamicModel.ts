// models/CustomFieldInput.ts
import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    AutoIncrement,
    ForeignKey,
} from "sequelize-typescript";
import { TextInput } from "./Fields/TextInput";
import { LongTextInput } from "./Fields/LongTextInput";
import { DateInput } from "./Fields/DateInput";
import { NumberInput } from "./Fields/NumberInput";
import { CheckboxInput } from "./Fields/CheckboxInput";
import { LookupInput } from "./Fields/LookupInput";

@Table({
    tableName: "DynamicModel",
    timestamps: false,
})
export class DynamicModel extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @Column(DataType.STRING)
    declare name: string;

    @Column({
        type: DataType.STRING,
    })
    declare description: string;

    @Column({
        type: DataType.STRING,
    })
    declare layoutType: string;

    TextInputs?: TextInput[]
    LongTextInputs?: LongTextInput[]
    DateInputs?: DateInput[]
    NumberInputs?: NumberInput[]
    CheckboxInputs?: CheckboxInput[]
    LookupInputs?: LookupInput[]
}

@Table({
    tableName: "LineItem",
    timestamps: true,
})
export class LineItem extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @ForeignKey(() => DynamicModel)
    @Column(DataType.UUID)
    declare modelId: string;

}
