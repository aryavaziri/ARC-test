"use server";
import * as tedious from "tedious"; // Assuming you're using Tedious for MSSQL
import { handleWithTryCatch } from "@/lib/helpers";

import sequelize from "@/lib/Sequelize";
import { Sequelize } from "sequelize-typescript";
import { User } from "@/models/UserData/User";
import { UserRole } from "@/models/UserData/UserRole";
import { ModelTextInput, ModelDateInput, ModelLongTextInput, ModelNumberInput, ModelCheckboxInput, ModelLookupInput } from "@/models/Dynamic/M2M";
import { CheckboxInputRecord, DateInputRecord, LongTextInputRecord, LookupInputRecord, NumberInputRecord, TextInputRecord } from "@/models/Dynamic/Records";
import { DynamicModel, FormLayout, LineItem, RecordLayout } from "@/models/Dynamic/DynamicModel";
import { TextInput, CheckboxInput, DateInput, LongTextInput, LookupInput, LookupInputSearchColumn, LookupInputTableColumn, NumberInput } from "@/models/Dynamic/Fields";
import { TabModel } from "@/models/Layout/Tabs";
import { PageLayout } from "@/models/Layout/PageLayout";
import { Flow } from "@/models/Flow/Flow";
import { resetAllRecordLayouts } from "../Dynamic/SchemaReset";


export const dropDatabase = async (db: string) => {
  return handleWithTryCatch(async () => {
    await sequelizeWithoutDb.authenticate();
    console.log("Connection has been established successfully.");
    await sequelizeWithoutDb.query(`
        IF EXISTS (SELECT * FROM sys.databases WHERE name = '${db}')
        BEGIN
          ALTER DATABASE ${db} SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
          DROP DATABASE ${db};
        END
        CREATE DATABASE ${db};
      `);
    console.log(`Database '${db}' dropped and recreated successfully.`);
  });
};


const sequelizeWithoutDb = new Sequelize({
  dialect: "mssql",
  username: "sa",
  password: process.env.SA_PASSWORD,
  host: process.env.DB_HOST,
  port: 1435,
  define: { underscored: true },
  dialectModule: tedious,
  dialectOptions: {
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  },
  // logging: console.log,
});

export const syncTables = async () => {
  // await dropDatabase(process.env.CentralizedDB ?? "")
  await sequelize.authenticate();
  // await syncUserModels();
  // await syncDynamicModels();
  // await importUserBac('arcerp_dev1')
  console.log("Models synchronized successfully.");
};

const syncDynamicModels = async () => {
  return handleWithTryCatch(async () => {
    await TextInput.sync({ alter: true });
    await LongTextInput.sync({ alter: true });
    await DateInput.sync({ alter: true });
    await NumberInput.sync({ alter: true });
    await CheckboxInput.sync({ alter: true });
    await LookupInput.sync({ alter: true });

    await DynamicModel.sync({ alter: true });
    await LineItem.sync({ alter: true });
    await FormLayout.sync({ alter: true });
    await RecordLayout.sync({ alter: true });
    await PageLayout.sync({ alter: true });

    await ModelTextInput.sync({ alter: true });
    await ModelLongTextInput.sync({ alter: true });
    await ModelNumberInput.sync({ alter: true });
    await ModelDateInput.sync({ alter: true });
    await ModelCheckboxInput.sync({ alter: true });
    await ModelLookupInput.sync({ alter: true });

    await TextInputRecord.sync({ alter: true });
    await NumberInputRecord.sync({ alter: true });
    await DateInputRecord.sync({ alter: true });
    await LongTextInputRecord.sync({ alter: true });
    await CheckboxInputRecord.sync({ alter: true });
    await LookupInputRecord.sync({ alter: true });

    // await LookupInputSearchColumn.sync({ alter: true });
    // await LookupInputTableColumn.sync({ alter: true });

    console.log("Dynamic Models has been synced");
  });
};

const syncUserModels = async () => {
  return handleWithTryCatch(async () => {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await TabModel.sync({ alter: true });
    await Flow.sync({ alter: true });
    await UserRole.sync({ alter: true });
    await User.sync({ alter: true });
    console.log("User Models has been synced");
  });
};


const importUserBac = async (base: string) => {
  return handleWithTryCatch(async () => {
    await sequelizeWithoutDb.query(`
      EXEC sp_MSforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT ALL";
      `);

    await sequelizeWithoutDb.query(`
        SET IDENTITY_INSERT ${process.env.CentralizedDB}.dbo.UserRoles ON;
      
        INSERT INTO ${process.env.CentralizedDB}.dbo.UserRoles (id, role, updated_at, created_at)
        SELECT id, role, updated_at, created_at
        FROM ${base}.dbo.UserRoles;
      
        SET IDENTITY_INSERT ${process.env.CentralizedDB}.dbo.UserRoles OFF;
      `);

    await sequelizeWithoutDb.query(`
      INSERT INTO ${process.env.CentralizedDB}.dbo.Users (id, email, hpassword, first_name, last_name, profile_img, role_id, updated_at, created_at)
      SELECT id, email, hpassword, first_name, last_name, profile_img, role_id, updated_at, created_at
      FROM ${base}.dbo.Users;
      `);

    await sequelizeWithoutDb.query(`
        EXEC sp_MSforeachtable "ALTER TABLE ? WITH CHECK CHECK CONSTRAINT ALL";
      `);

    console.log(`Data imported successfully from ${base}.`);
  });
};