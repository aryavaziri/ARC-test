import { Sequelize } from "sequelize-typescript";
import * as tedious from "tedious";

import { User } from "@/models/UserData/User";
import { UserRole } from "@/models/UserData/UserRole";
import { setAssociations as setUserDataAssociations } from "@/models/UserData/assosiations";
import { setAssociations as setCustomerAssociations } from "@/models/Customer/assosiations";
import { setAssociations as setDynamicAssociations } from "@/models/Dynamic/assosiations";
import { Status } from "@/models/Customer/Status";
import { State } from "@/models/Customer/State";
import { Address } from "@/models/Customer/Address";
import { Customer } from "@/models/Customer/Customer";
import { TextInput } from "@/models/Dynamic/Fields/TextInput";
import { LongTextInput } from "@/models/Dynamic/Fields/LongTextInput";
import { CheckboxInput } from "@/models/Dynamic/Fields/CheckboxInput";
import { DateInput } from "@/models/Dynamic/Fields/DateInput";
import { NumberInput } from "@/models/Dynamic/Fields/NumberInput";
import { DynamicModel } from "@/models/Dynamic/DynamicModel";
import { ModelTextInput, ModelDateInput, ModelLongTextInput, ModelNumberInput, ModelCheckboxInput } from "@/models/Dynamic/M2M";
import { CheckboxInputRecord, DateInputRecord, LongTextInputRecord, NumberInputRecord, TextInputRecord } from "@/models/Dynamic/Records";

const UserModels = [UserRole, User];
const CustomerModels = [Customer, State, Status, Address];
const DynamicModels = [TextInput, LongTextInput, DateInput, NumberInput, DynamicModel, ModelDateInput, ModelLongTextInput, ModelNumberInput, ModelCheckboxInput, TextInputRecord, NumberInputRecord,CheckboxInput, DateInputRecord, CheckboxInputRecord, LongTextInputRecord, ModelTextInput];


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
  models: [...UserModels, ...CustomerModels, ...DynamicModels],
});

setUserDataAssociations();
setCustomerAssociations();
setDynamicAssociations();


export default sequelize;
