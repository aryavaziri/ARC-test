import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
} from "sequelize-typescript";

@Table({
  tableName: "TextInputs",
  timestamps: true,
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

  @Column({
    type: DataType.BOOLEAN,
    // allowNull: true,
    // defaultValue: false,
  })
  declare isRequired: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare maxLength: number;

}
