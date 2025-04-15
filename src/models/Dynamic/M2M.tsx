import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo, Default, AfterCreate } from "sequelize-typescript";
import { DynamicModel, FormLayout } from "./DynamicModel";
import { TextInput } from "./Fields/TextInput";
import { LongTextInput } from "./Fields/LongTextInput";
import { DateInput } from "./Fields/DateInput";
import { NumberInput } from "./Fields/NumberInput";
import { CheckboxInput } from "./Fields/CheckboxInput";
import { LookupInput } from "./Fields/LookupInput";
import sequelize from "@/lib/Sequelize";

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

  // @AfterCreate
  // static async updateFormLayout(instance: ModelTextInput) {
  //   await sequelize.authenticate();
  //   const layout = await FormLayout.findOne({ where: { modelId: instance.modelId, label: 'Standard' } });
  //   console.log(layout?.label)
  //   const input = await TextInput.findByPk(instance.inputId);
  //   console.log(input?.label)
  //   console.log("TEST")

  //   if (layout && input) {
  //     const schema = layout.contentSchema ?? [];
  //     schema.push({
  //       fieldId: input.id,
  //       type: 'text',
  //       order: schema.length,
  //     });
  //     await layout.update({ contentSchema: schema });
  //   }
  // }
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

  // @AfterCreate
  // static async updateFormLayout(instance: ModelLongTextInput) {
  //   await sequelize.authenticate();
  //   const layout = await FormLayout.findOne({ where: { modelId: instance.modelId, label: 'Standard' } });
  //   const input = await LongTextInput.findByPk(instance.inputId);

  //   if (layout && input) {
  //     const schema = layout.contentSchema ?? [];
  //     schema.push({
  //       fieldId: input.id,
  //       type: 'text',
  //       order: schema.length,
  //     });
  //     await layout.update({ contentSchema: schema });
  //   }
  // }
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

  // @AfterCreate
  // static async updateFormLayout(instance: ModelDateInput) {
  //   await sequelize.authenticate();
  //   const layout = await FormLayout.findOne({ where: { modelId: instance.modelId, label: 'Standard' } });
  //   const input = await DateInput.findByPk(instance.inputId);

  //   if (layout && input) {
  //     const schema = layout.contentSchema ?? [];
  //     schema.push({
  //       fieldId: input.id,
  //       type: 'text',
  //       order: schema.length,
  //     });
  //     await layout.update({ contentSchema: schema });
  //   }
  // }
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

  // @AfterCreate
  // static async updateFormLayout(instance: ModelNumberInput) {
  //   await sequelize.authenticate();
  //   const layout = await FormLayout.findOne({ where: { modelId: instance.modelId, label: 'Standard' } });
  //   const input = await NumberInput.findByPk(instance.inputId);

  //   if (layout && input) {
  //     const schema = layout.contentSchema ?? [];
  //     schema.push({
  //       fieldId: input.id,
  //       type: 'text',
  //       order: schema.length,
  //     });
  //     await layout.update({ contentSchema: schema });
  //   }
  // }
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

  // @AfterCreate
  // static async updateFormLayout(instance: ModelCheckboxInput) {
  //   await sequelize.authenticate();
  //   const layout = await FormLayout.findOne({ where: { modelId: instance.modelId, label: 'Standard' } });
  //   const input = await CheckboxInput.findByPk(instance.inputId);

  //   if (layout && input) {
  //     const schema = layout.contentSchema ?? [];
  //     schema.push({
  //       fieldId: input.id,
  //       type: 'text',
  //       order: schema.length,
  //     });
  //     await layout.update({ contentSchema: schema });
  //   }
  // }
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

  // @AfterCreate
  // static async updateFormLayout(instance: ModelLookupInput) {
  //   await sequelize.authenticate();
  //   const layout = await FormLayout.findOne({ where: { modelId: instance.modelId, label: 'Standard' } });
  //   const input = await LookupInput.findByPk(instance.inputId);

  //   if (layout && input) {
  //     const schema = layout.contentSchema ?? [];
  //     // schema.push({
  //     //   fieldId: input.id,
  //     //   type: 'text',
  //     //   order: schema.length,
  //     // });
  //     await layout.update({ contentSchema: schema });
  //   }
  // }
}

