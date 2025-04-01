import { Table, Column, Model, DataType, PrimaryKey, Default } from "sequelize-typescript";

@Table({
  tableName: "NumberInputs",
  timestamps: false,
})
export class NumberInput extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare label: string;

  @Column(DataType.INTEGER)
  declare min: number;

  @Column(DataType.INTEGER)
  declare max: number;

  @Column(DataType.STRING)
  declare numberType: string;

  @Column(DataType.BOOLEAN)
  declare isRequired: boolean;
}
