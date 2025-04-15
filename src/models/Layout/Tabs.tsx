import { Table, Column, Model, DataType, PrimaryKey, AllowNull, Default } from 'sequelize-typescript';

@Table({ tableName: "Tabs", timestamps: false })
export class TabModel extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare label: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare iconName: string;

    @Column({
        type: DataType.TEXT,
        get() {
            const raw = this.getDataValue("layouts");
            return raw ? JSON.parse(raw) : [];
        },
        set(value: any[]) {
            this.setDataValue("layouts", JSON.stringify(value ?? []));
        },
    })
    declare layouts?: any[]; // or use a stricter type if desired
}
