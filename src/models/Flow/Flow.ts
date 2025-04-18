import { Table, Column, Model, DataType, PrimaryKey, AllowNull, Default } from 'sequelize-typescript';

@Table({ tableName: "Flows", timestamps: false })
export class Flow extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare name: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    declare script: string;

    @Column(DataType.ENUM("beforeSubmit", "afterSubmit", "custom"))
    declare triggerType: "beforeSubmit" | "afterSubmit" | "custom";

    @Column(DataType.STRING)
    declare targetType: "model" | "layout" | "form" | "field" | "button";

    @Column(DataType.UUID)
    declare targetId: string; // ID of the model, layout, etc.

    @Column(DataType.BOOLEAN)
    declare isActive: boolean;

}
