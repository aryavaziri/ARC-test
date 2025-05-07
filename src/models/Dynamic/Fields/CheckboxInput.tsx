import { Table, Column, Model, DataType, PrimaryKey, Default } from "sequelize-typescript";
  
  @Table({
    tableName: "CheckboxInputs",
    timestamps: false,
  })
  export class CheckboxInput extends Model {
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
  }
  