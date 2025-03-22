import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
  } from "sequelize-typescript";
  
  @Table({
    tableName: "States",
    timestamps: true, // Optional: if you want createdAt & updatedAt
  })
  export class State extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    declare name: string;
  }
  