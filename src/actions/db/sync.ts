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
  await sequelize.authenticate();
  // await syncCustomerModels();
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

const syncUserModels = async () => {
  return handleWithTryCatch(async () => {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await UserRole.sync({ alter: true });
    await User.sync();
    console.log("User Models has been synced");
  });
};
