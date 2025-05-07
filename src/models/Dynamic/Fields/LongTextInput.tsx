import { Table, Column, Model, DataType, PrimaryKey, Default } from "sequelize-typescript";
@Table({
  tableName: "LongTextInputs",
  timestamps: false,
})
export class LongTextInput extends Model {
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

  @Column(DataType.INTEGER)
  declare maxLength: number;

  @Column(DataType.BOOLEAN)
  declare isHidden: boolean;

}
