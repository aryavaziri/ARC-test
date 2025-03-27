import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
  } from "sequelize-typescript";
  
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
  
    @Column({
      type: DataType.INTEGER,
      allowNull: true,
    })
    declare min: number;
  
    @Column({
      type: DataType.INTEGER,
      allowNull: true,
    })
    declare max: number;

    @Column({
      type: DataType.BOOLEAN,
      // allowNull: true,
      // defaultValue: false,
    })
    declare isRequired: boolean;
  }
  