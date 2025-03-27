// models/CustomFieldInput.ts
import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
} from "sequelize-typescript";
import { TextInput } from "./Fields/TextInput";
import { LongTextInput } from "./Fields/LongTextInput";
import { DateInput } from "./Fields/DateInput";
import { NumberInput } from "./Fields/NumberInput";

@Table({
    tableName: "DynamicModel",
    timestamps: true,
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

    TextInputs!: TextInput[]
    LongTextInputs!: LongTextInput[]
    DateInputs!: DateInput[]
    NumberInputs!: NumberInput[]

}
