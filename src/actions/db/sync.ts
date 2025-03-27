"use server";
import * as tedious from "tedious"; // Assuming you're using Tedious for MSSQL
import { handleWithTryCatch } from "@/lib/helpers";

import sequelize from "@/lib/Sequelize";
import { Sequelize } from "sequelize-typescript";
import { User } from "@/models/UserData/User";
import { UserRole } from "@/models/UserData/UserRole";
import { Customer } from "@/models/Customer/Customer";
import { State } from "@/models/Customer/State";
import { Status } from "@/models/Customer/Status";
import { Address } from "@/models/Customer/Address";
import { TextInput } from "@/models/Dynamic/Fields/TextInput";
import { LongTextInput } from "@/models/Dynamic/Fields/LongTextInput";
import { DateInput } from "@/models/Dynamic/Fields/DateInput";
import { NumberInput } from "@/models/Dynamic/Fields/NumberInput";
import { ModelTextInput, ModelDateInput, ModelLongTextInput, ModelNumberInput, ModelCheckboxInput } from "@/models/Dynamic/M2M";
import { CheckboxInputRecord, DateInputRecord, LongTextInputRecord, NumberInputRecord, TextInputRecord } from "@/models/Dynamic/Records";
import { DynamicModel } from "@/models/Dynamic/DynamicModel";
import { CheckboxInput } from "@/models/Dynamic/Fields/CheckboxInput";


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
  // await dropDatabase('arcerp_dev2')
  // await sequelize.authenticate();
  // await syncUserModels();
  // await syncCustomerModels();
  // await syncDynamicModels();
  // await importUserBac('arcerp_dev1', 'arcerp_dev2')
  console.log("Models synchronized successfully.");
};

const syncCustomerModels = async () => {
  return handleWithTryCatch(async () => {
    // await sequelize.authenticate();
    // console.log("Connection has been established successfully.");
    await Customer.sync({ alter: true });
    await State.sync({ alter: true });
    await Status.sync({ alter: true });
    await Address.sync({ alter: true });
    console.log("Customer Models has been synced");
  });
};

const syncDynamicModels = async () => {
  return handleWithTryCatch(async () => {
    // await sequelize.authenticate();
    // console.log("Connection has been established successfully.");
    await TextInput.sync({ alter: true });
    await LongTextInput.sync({ alter: true });
    await DateInput.sync({ alter: true });
    await NumberInput.sync({ alter: true });
    await CheckboxInput.sync({ alter: true });

    await DynamicModel.sync({ alter: true });

    await ModelTextInput.sync({ alter: true });
    await ModelLongTextInput.sync({ alter: true });
    await ModelNumberInput.sync({ alter: true });
    await ModelDateInput.sync({ alter: true });
    await ModelCheckboxInput.sync({ alter: true });

    await TextInputRecord.sync({ alter: true });
    await NumberInputRecord.sync({ alter: true });
    await DateInputRecord.sync({ alter: true });
    await LongTextInputRecord.sync({ alter: true });
    await CheckboxInputRecord.sync({ alter: true });

    console.log("Dynamic Models has been synced");
  });
};

const syncUserModels = async () => {
  return handleWithTryCatch(async () => {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await UserRole.sync({ alter: true });
    await User.sync({ alter: true });
    console.log("User Models has been synced");
  });
};


const importUserBac = async (base: string, destination: string) => {
  return handleWithTryCatch(async () => {
    await sequelizeWithoutDb.query(`
      EXEC sp_MSforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT ALL";
      `);

      await sequelizeWithoutDb.query(`
        SET IDENTITY_INSERT ${destination}.dbo.UserRoles ON;
      
        INSERT INTO ${destination}.dbo.UserRoles (id, role, updated_at, created_at)
        SELECT id, role, updated_at, created_at
        FROM ${base}.dbo.UserRoles;
      
        SET IDENTITY_INSERT ${destination}.dbo.UserRoles OFF;
      `);

    await sequelizeWithoutDb.query(`
      INSERT INTO ${destination}.dbo.Users (id, email, first_name, last_name, profile_img, role_id, updated_at, created_at)
      SELECT id, email, first_name, last_name, profile_img, role_id, updated_at, created_at
      FROM ${base}.dbo.Users;
      `);

    await sequelizeWithoutDb.query(`
        EXEC sp_MSforeachtable "ALTER TABLE ? WITH CHECK CHECK CONSTRAINT ALL";
      `);

    console.log(`Data imported successfully from ${base}.`);
  });
};