import { Address } from "./Address";
import { Customer } from "./Customer";
import { State } from "./State";
import { Status } from "./Status";

export const setAssociations = () => {
    Address.belongsTo(Customer, { foreignKey: "customerId", as: "customer", onDelete: "CASCADE" });
    Address.belongsTo(State, { foreignKey: "stateId", as: "state", onDelete: "SET NULL" });
    Address.belongsTo(Status, { foreignKey: "statusId", as: "status", onDelete: "CASCADE" });
}
