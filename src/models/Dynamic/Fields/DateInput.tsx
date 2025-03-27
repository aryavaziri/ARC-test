import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
  } from "sequelize-typescript";
  
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
    
    @Column({
      type: DataType.BOOLEAN,
      // allowNull: true,
      // defaultValue: false,
    })
    declare isRequired: boolean;

    @Column({
      type: DataType.DATE, // You could also use STRING if you're sure it's short
      allowNull: true,
    })
    declare startRange: string;

    @Column({
      type: DataType.DATE, // You could also use STRING if you're sure it's short
      allowNull: true,
    })
    declare endRange: string;
  }
  