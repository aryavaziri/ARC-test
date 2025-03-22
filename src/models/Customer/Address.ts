import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import { Customer } from "./Customer"; // assuming you have Customer model
import { State } from "./State";       // assuming separate model for state
import { Status } from "./Status";     // assuming separate model for status

@Table({
    tableName: "Addresses",
    timestamps: true, // enables createdAt & updatedAt
})
export class Address extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @ForeignKey(() => Customer)
    @Column(DataType.UUID)
    declare customerId: string;

    @Column(DataType.INTEGER)
    declare addressType: number;

    @Column(DataType.STRING)
    declare address1?: string;

    @Column(DataType.STRING)
    declare address2?: string;

    @Column(DataType.STRING)
    declare city?: string;

    @Column(DataType.STRING)
    declare zipCode?: string;

    @ForeignKey(() => State)
    @Column(DataType.UUID)
    declare stateId?: string;

    @ForeignKey(() => Status)
    @Column(DataType.UUID)
    declare statusId: string;

    @Column(DataType.BOOLEAN)
    declare defaultAddress?: boolean;

    @Column(DataType.BOOLEAN)
    declare isDropShip?: boolean;

    @Column(DataType.STRING)
    declare companySite?: string;

    @Column(DataType.STRING)
    declare county?: string;

    customer?: Customer;
    state?: State;
    status?: Status;
}
