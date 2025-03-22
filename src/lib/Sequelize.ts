import { Sequelize } from "sequelize-typescript";
import * as tedious from "tedious";

import { User } from "@/models/UserData/User";
import { UserRole } from "@/models/UserData/UserRole";
import { setAssociations as setUserDataAssociations } from "@/models/UserData/assosiations";
import { setAssociations as setCustomerAssociations } from "@/models/Customer/assosiations";
import { Status } from "@/models/Customer/Status";
import { State } from "@/models/Customer/State";
import { Address } from "@/models/Customer/Address";
import { Customer } from "@/models/Customer/Customer";

const UserModels = [UserRole, User];
const CustomerModels = [Customer, State, Status, Address];


const sequelize = new Sequelize({
  database: process.env.CentralizedDB,
  dialect: "mssql",
  username: "sa",
  password: process.env.SA_PASSWORD,
  host: process.env.DB_HOST,
  port: 1435,
  dialectModule: tedious,
  define: { underscored: true },
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
      requestTimeout: 30000,
    },
  },
  logging: false,
  models: [...UserModels, ...CustomerModels],
});

setUserDataAssociations();
setCustomerAssociations();


export default sequelize;
