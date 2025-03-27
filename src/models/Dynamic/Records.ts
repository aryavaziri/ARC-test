import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, Default } from "sequelize-typescript";
import { ModelCheckboxInput, ModelDateInput, ModelLongTextInput, ModelNumberInput, ModelTextInput } from "./M2M";
import { DynamicModel } from "@/models/Dynamic/DynamicModel";

// ✅ TextInputRecord
@Table({
    tableName: "TextInputRecord",
    timestamps: false,
})
export class TextInputRecord extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID })
    declare id: string;

    @ForeignKey(() => DynamicModel)
    @Column(DataType.UUID)
    declare modelId: string;

    @ForeignKey(() => ModelTextInput)
    @Column(DataType.UUID)
    declare fieldId: string;


    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare value: string;
}

// ✅ NumberInputRecord
@Table({
    tableName: "NumberInputRecord",
    timestamps: false,
})
export class NumberInputRecord extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID })
    declare id: string;

    @ForeignKey(() => DynamicModel)
    @Column(DataType.UUID)
    declare modelId: string;

    @ForeignKey(() => ModelNumberInput)
    @Column(DataType.UUID)
    declare fieldId: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare label: string;

    @Column(DataType.FLOAT)
    declare value: number;
}

// ✅ DateInputRecord
@Table({
    tableName: "DateInputRecord",
    timestamps: false,
})
export class DateInputRecord extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID })
    declare id: string;

    @ForeignKey(() => DynamicModel)
    @Column(DataType.UUID)
    declare modelId: string;

    @ForeignKey(() => ModelDateInput)
    @Column(DataType.UUID)
    declare fieldId: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare label: string;

    @Column(DataType.DATE)
    declare value: Date;
}

// ✅ LongTextInputRecord
@Table({
    tableName: "LongTextInputRecord",
    timestamps: false,
})
export class LongTextInputRecord extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID })
    declare id: string;

    @ForeignKey(() => DynamicModel)
    @Column(DataType.UUID)
    declare modelId: string;

    @ForeignKey(() => ModelLongTextInput)
    @Column(DataType.UUID)
    declare fieldId: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare label: string;

    @Column(DataType.TEXT)
    declare value: string;
}

// ✅ CheckboxInputRecord
@Table({
    tableName: "CheckboxRecord",
    timestamps: false,
})
export class CheckboxInputRecord extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID })
    declare id: string;

    @ForeignKey(() => DynamicModel)
    @Column(DataType.UUID)
    declare modelId: string;

    @ForeignKey(() => ModelCheckboxInput)
    @Column(DataType.UUID)
    declare fieldId: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare label: string;

    @Column(DataType.BOOLEAN)
    declare value: boolean;
}
