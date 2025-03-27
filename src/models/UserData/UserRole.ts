import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, HasMany, BeforeCreate } from "sequelize-typescript";
import { User } from "./User";

@Table({
    tableName: "UserRoles",
})
export class UserRole extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
    })
    declare id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        // unique: true,
    })
    declare role: string;

}
