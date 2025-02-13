import { Op, Sequelize } from "sequelize";
import User, { initUser } from "./users";
import UserAccountMeta, { initUserAccountMeta } from "./users-account-meta";
import UserLoginMeta, { initUserLoginMeta } from "./users-login-meta";
import Doctor, { initDoctor } from "./doctor";
import Patient, { initPatient } from "./patient";
import Reminder, { initReminder } from "./reminder";
import ActionableStep, { initActionableStep } from "./actionable-steps";
import DoctorPatient, { initDoctorPatient } from "./doctor-patient";
import DoctorNote, { initDoctorNote } from "./doctor-notes";


import configFile from "../config";


const env = configFile?.app?.env || "development";
const config = require(__dirname + "/../config/database.js")[env];

const operatorsAliases = {
  gt: Op.gt,
  lt: Op.lt,
  in: Op.in,
  notIn: Op.notIn,
  eq: Op.eq,
  between: Op.between,
  regex: Op.regexp,
  contains: Op.contains,
  notContains: Op.notBetween,
};

export const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    operatorsAliases,
    logging: false,
  }
);

const models = {
  User: User,
  UserAccountMeta: UserAccountMeta,
  UserLoginMeta: UserLoginMeta,
  Doctor: Doctor,
  Patient: Patient,
  Reminder: Reminder,
  ActionableStep: ActionableStep,
  DoctorPatient: DoctorPatient,
  DoctorNote: DoctorNote,
};

//init models~
export const initDb = (sequelize: Sequelize) => {
  initUser(sequelize);
  initUserAccountMeta(sequelize);
  initUserLoginMeta(sequelize);
  initDoctor(sequelize);
  initPatient(sequelize);
  initReminder(sequelize);
  initActionableStep(sequelize);
  initDoctorPatient(sequelize);
  initDoctorNote(sequelize);

  // run the associations between models
  Object.values(models)
    .filter((model) => typeof model.associate === "function")
    .forEach((model) => model.associate(models));
};
// sequelize.sync({ alter: isDev });

export const closeDb = (sequelize: Sequelize) => sequelize.close();

// Run `.associate` if it exists,
// ie create relationships in the ORM
// Object.values(models)
//   .filter((model) => typeof model.associate === "function")
//   .forEach((model) => model.associate(models));

export {
  User,
  UserAccountMeta,
  UserLoginMeta,
  Doctor,
  Patient,
  Reminder,
  ActionableStep,
  DoctorPatient,
  DoctorNote,
};
