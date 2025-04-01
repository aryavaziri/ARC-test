import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo, Default } from "sequelize-typescript";
import { DynamicModel } from "./DynamicModel";
import { TextInput } from "./Fields/TextInput";
import { LongTextInput } from "./Fields/LongTextInput";
import { DateInput } from "./Fields/DateInput";
import { NumberInput } from "./Fields/NumberInput";
import { CheckboxInput } from "./Fields/CheckboxInput";
import { LookupInput } from "./Fields/LookupInput";

@Table({
  tableName: "ModelTextInput",
  timestamps: false,
})
export class ModelTextInput extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => DynamicModel)
  @Column(DataType.UUID)
  declare modelId: string;

  @ForeignKey(() => TextInput)
  @Column(DataType.UUID)
  declare inputId: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare order: number;
}

@Table({
  tableName: "ModelLongTextInput",
  timestamps: false,
})
export class ModelLongTextInput extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => DynamicModel)
  @Column(DataType.UUID)
  declare modelId: string;

  @ForeignKey(() => LongTextInput)
  @Column(DataType.UUID)
  declare inputId: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare order: number;
}

@Table({
  tableName: "ModelDateInput",
  timestamps: false,
})
export class ModelDateInput extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => DynamicModel)
  @Column(DataType.UUID)
  declare modelId: string;

  @ForeignKey(() => DateInput)
  @Column(DataType.UUID)
  declare inputId: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare order: number;
}

@Table({
  tableName: "ModelNumberInput",
  timestamps: false,
})
export class ModelNumberInput extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => DynamicModel)
  @Column(DataType.UUID)
  declare modelId: string;

  @ForeignKey(() => NumberInput)
  @Column(DataType.UUID)
  declare inputId: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare order: number;
}

@Table({
  tableName: "ModelCheckboxInput",
  timestamps: false,
})
export class ModelCheckboxInput extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => DynamicModel)
  @Column(DataType.UUID)
  declare modelId: string;

  @ForeignKey(() => CheckboxInput)
  @Column(DataType.UUID)
  declare inputId: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare order: number;
}

@Table({
  tableName: "ModelLookupInput",
  timestamps: false,
})
export class ModelLookupInput extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => DynamicModel)
  @Column(DataType.UUID)
  declare modelId: string;

  @ForeignKey(() => LookupInput)
  @Column(DataType.UUID)
  declare inputId: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare order: number;
}

