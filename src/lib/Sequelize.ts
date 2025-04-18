import { Sequelize } from "sequelize-typescript";
import * as tedious from "tedious";

import { User } from "@/models/UserData/User";
import { UserRole } from "@/models/UserData/UserRole";
import { setAssociations as setUserDataAssociations } from "@/models/UserData/assosiations";
import { setAssociations as setDynamicAssociations } from "@/models/Dynamic/assosiations";
import { TextInput, CheckboxInput, DateInput, LongTextInput, LookupInput, LookupInputSearchColumn, LookupInputTableColumn, NumberInput } from "@/models/Dynamic/Fields";
import { DynamicModel, FormLayout, LineItem, RecordLayout } from "@/models/Dynamic/DynamicModel";
import { ModelTextInput, ModelDateInput, ModelLongTextInput, ModelNumberInput, ModelCheckboxInput, ModelLookupInput } from "@/models/Dynamic/M2M";
import { CheckboxInputRecord, DateInputRecord, LongTextInputRecord, LookupInputRecord, NumberInputRecord, TextInputRecord } from "@/models/Dynamic/Records";
import { TabModel } from "@/models/Layout/Tabs";
import { PageLayout } from "@/models/Layout/PageLayout";
import { Flow } from "@/models/Flow/Flow";

const UserModels = [UserRole, User];
const DynamicModels = [TextInput, LongTextInput, DateInput, NumberInput, DynamicModel, ModelDateInput, ModelLongTextInput, ModelNumberInput, ModelCheckboxInput, TextInputRecord, NumberInputRecord, CheckboxInput, DateInputRecord, CheckboxInputRecord, LongTextInputRecord, ModelTextInput, LineItem, LookupInput, LookupInputRecord, ModelLookupInput, LookupInputSearchColumn, LookupInputTableColumn, FormLayout, TabModel, PageLayout, RecordLayout, Flow];


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
  models: [...UserModels, ...DynamicModels],
});

setUserDataAssociations();
setDynamicAssociations();


export default sequelize;
