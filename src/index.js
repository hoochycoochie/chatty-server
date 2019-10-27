import express from "express";
import { ApolloServer } from "apollo-server-express";
import path from "path";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import cors from "cors";
import jwt from "jsonwebtoken";
import { createServer } from "http";

import models from "./models";
import mocks from "./mock";

const SECRET = "asiodfhoi1hoi23jnl1kejd";
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./schema")));
const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./resolvers"))
);
const PORT = process.env.PORT || "3001";

const app = express();

app.use(cors("*"));

const addUser = async (req, res, next) => {
  const header = req.headers.authorization;

  let token;
  if (header) token = header.split(" ")[1];
  if (token) {
    try {
      const { user } = await jwt.verify(token, SECRET);

      req.user = user;
      req.token = token;
    } catch (err) {
      console.log("error adding user=============", err);

      throw err;
    }
  }
  next();
};

app.use(addUser);

const server = new ApolloServer({
  typeDefs,
  resolvers,

  context: ({ req, connection }) => {
    if (connection) {
      return connection.context;
    } else {
      return {
        user: req && req.user ? req.user : null,
        token:
          req && req.headers && req.headers.authorization
            ? req.headers.authorization.split(" ")[1]
            : null,
        SECRET
      };
    }
  },

  subscriptions: {
    onConnect: async ({ token }, webSocket) => {
      if (token) {
        try {
          const { user } = jwt.verify(token, SECRET);

          return { user };
        } catch (err) {
          throw err;
        }
      }

      return { user: null };
    }
  }
});
server.applyMiddleware({ app });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

models.sequelize.sync({ force: false }).then(() => {
  // mocks().then(() => {
  //   httpServer.listen(PORT, () => {});
  // });

  httpServer.listen(PORT, () => {});
});
