import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey } from "sequelize-typescript";
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

  @Column(DataType.BOOLEAN)
  declare isHidden: boolean;

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
}