import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
  } from "sequelize-typescript";
  
  @Table({
    tableName: "Customers",
    timestamps: true,
  })
  export class Customer extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    declare companyName: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    declare accountNumber?: string;
  }
  