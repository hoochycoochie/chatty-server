import Sequelize from "sequelize";
import { config } from "../config";

const sequelize = new Sequelize("buddychat", "postgres", "amadou", {
  dialect: "postgres",
  operatorsAliases: Sequelize.Op,
  host: process.env.DB_HOST || "localhost",
  define: {
    underscored: true
  }
});

const models = {
  User: sequelize.import("./user"),
  Channel: sequelize.import("./channel"),
  Message: sequelize.import("./message"),
  UserChannel: sequelize.import("./userChannel"),
  PrivateMessage: sequelize.import("./privateMessage")
};

Object.keys(models).forEach(modelName => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;
models.op = Sequelize.Op;

export default models;
