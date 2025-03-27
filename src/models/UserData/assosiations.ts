import { User } from "../UserData/User";
import { UserRole } from "./UserRole";

export const setAssociations = () => {
  User.belongsTo(UserRole, { foreignKey: "roleId", as: "role", onDelete: "CASCADE" });
};
