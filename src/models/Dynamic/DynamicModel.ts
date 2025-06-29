import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, AllowNull, AfterCreate, Index } from "sequelize-typescript";
import { TextInput, CheckboxInput, DateInput, LongTextInput, LookupInput, NumberInput } from "./Fields";
import { User } from "../UserData/User";

@Table({
    tableName: "DynamicModel",
    timestamps: false,
})
export class DynamicModel extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @Index({ unique: true })
    @Column(DataType.STRING)
    declare name: string;

    @Column({ type: DataType.STRING })
    declare description: string;

    @Column({ type: DataType.STRING })
    declare layoutType: string;

    @Column({ type: DataType.BOOLEAN })
    declare showInConfiguration: boolean;

    TextInputs?: TextInput[]
    LongTextInputs?: LongTextInput[]
    DateInputs?: DateInput[]
    NumberInputs?: NumberInput[]
    CheckboxInputs?: CheckboxInput[]
    LookupInputs?: LookupInput[]

    @AfterCreate
    static async createDefaultFormLayout(instance: DynamicModel) {
        await FormLayout.create({
            label: 'Standard',
            modelId: instance.id,
            contentSchema: [],
        });
    }
}

@Table({
    tableName: "LineItem",
    timestamps: true,
})
export class LineItem extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @AllowNull(false)
    @ForeignKey(() => DynamicModel)
    @Column(DataType.UUID)
    declare modelId: string;

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    declare enteredBy: string;

}

@Table({
    tableName: "FormLayout",
    timestamps: false,
})
export class FormLayout extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare label: string;

    @AllowNull(false)
    @ForeignKey(() => DynamicModel)
    @Column(DataType.UUID)
    declare modelId: string;

    @AllowNull(false)
    @Column({
        type: DataType.TEXT,
        get() {
            const rawValue = this.getDataValue("contentSchema");
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value: Record<string, any>) {
            this.setDataValue("contentSchema", JSON.stringify(value ?? []));
        },
    })
    declare contentSchema?: Record<string, any>;


    // @BeforeCreate
    // @BeforeUpdate
    // static validateFormSchema(instance: FormLayout) {
    //     if (instance.contentSchema) {
    //         const result = formLayoutSchema.partial({ id: true, contentSchema: true }).safeParse(instance.contentSchema);
    //         console.log()
    //         if (!result.success) {
    //             throw new Error(`Invalid form schema: ${JSON.stringify(result.error.format())}`);
    //         }
    //     }
    // }
}

@Table({
    tableName: "RecordLayout",
    timestamps: false,
})
export class RecordLayout extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare label: string;

    @Default(false)
    @Column(DataType.BOOLEAN)
    declare isGrid: boolean;

    @Default(false)
    @Column(DataType.BOOLEAN)
    declare allowAddingLineItems: boolean;

    @AllowNull(false)
    @ForeignKey(() => DynamicModel)
    @Column(DataType.UUID)
    declare modelId: string;

    @AllowNull(false)
    @Column({
        type: DataType.TEXT,
        get() {
            const rawValue = this.getDataValue("contentSchema");
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value: Record<string, any>) {
            this.setDataValue("contentSchema", JSON.stringify(value ?? []));
        },
    })
    declare contentSchema?: Record<string, any>;

    // @BeforeCreate
    // @BeforeUpdate
    // static validateFormSchema(instance: RecordLayout) {
    //     if (instance.contentSchema) {
    //         const result = recordLayoutSchema.safeParse(instance.contentSchema);
    //         if (!result.success) {
    //             throw new Error(`Invalid form schema: ${JSON.stringify(result.error.format())}`);
    //         }
    //     }
    // }
}
