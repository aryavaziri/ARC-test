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
    }
    )
    declare id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare role: string;

    @BeforeCreate
    static async setCustomAutoIncrement(userRole: UserRole) {
        const lastRecord = await UserRole.findOne({
            order: [["id", "DESC"]],
        });
        userRole.id = lastRecord ? lastRecord.id + 1 : 1;
    }
}
