import { Table, Column, Model, DataType, PrimaryKey, AllowNull, Default, Unique, Index } from 'sequelize-typescript';

@Table({ tableName: 'PageLayouts', timestamps: true })
export class PageLayout extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

  @Index({ unique: true })
    @AllowNull(false)
    @Column(DataType.STRING)
    declare name: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare templateId: string;

    @AllowNull(false)
    @Column({
        type: DataType.TEXT,
        get() {
            const raw = this.getDataValue('contentSchema');
            return raw ? JSON.parse(raw) : {};
        },
        set(value: object) {
            this.setDataValue('contentSchema', JSON.stringify(value ?? []));
        },
    })
    declare contentSchema: Record<string, any>;
}