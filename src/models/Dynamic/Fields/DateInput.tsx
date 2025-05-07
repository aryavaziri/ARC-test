import { Table, Column, Model, DataType, PrimaryKey, Default } from "sequelize-typescript";

@Table({
  tableName: "DateInputs",
  timestamps: false,
})
export class DateInput extends Model {
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

  @Column(DataType.DATE)
  declare startRange: string;

  @Column(DataType.DATE)
  declare endRange: string;

  @Column(DataType.BOOLEAN)
  declare isHidden: boolean;

  @Column(DataType.STRING)
  declare format: string;

}
