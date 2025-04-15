import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, HasMany } from "sequelize-typescript";
import { DynamicModel } from "../DynamicModel";

@Table({ tableName: "LookupInputs", timestamps: false })
export class LookupInput extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare label: string;

  @Column(DataType.BOOLEAN)
  declare isRequired: boolean;

  @ForeignKey(() => DynamicModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare lookupModelId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare primaryFieldId: string;

  // @HasMany(() => LookupInputSearchColumn, 'lookupInputId')
  // searchModalColumns?: LookupInputSearchColumn[];

  // @HasMany(() => LookupInputTableColumn, 'lookupInputId')
  // recordTableColumns?: LookupInputTableColumn[];
}

@Table({ tableName: 'LookupInputSearchColumns', timestamps: false })
export class LookupInputSearchColumn extends Model {
  @PrimaryKey
  @ForeignKey(() => LookupInput)
  @Column({ type: DataType.UUID, allowNull: false })
  declare lookupInputId: string;

  @PrimaryKey
  @Column({ type: DataType.UUID, allowNull: false })
  declare fieldId: string;
}

@Table({ tableName: 'LookupInputTableColumns', timestamps: false })
export class LookupInputTableColumn extends Model {
  @PrimaryKey
  @ForeignKey(() => LookupInput)
  @Column({ type: DataType.UUID, allowNull: false })
  declare lookupInputId: string;

  @PrimaryKey
  @Column({ type: DataType.UUID, allowNull: false })
  declare fieldId: string;
}