import { Table, Column, Model, DataType, PrimaryKey, Default } from "sequelize-typescript";

@Table({
  tableName: "TextInputs",
  timestamps: false,
})
export class TextInput extends Model {
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
  declare maxLength: number;

  @Column(DataType.BOOLEAN)
  declare isRequired: boolean;

  @Column(DataType.BOOLEAN)
  declare isHidden: boolean;

}
