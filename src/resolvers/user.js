import formatError from "../utils/formatError";
import { login as authenticate } from "../utils/auth";
import { requireAuth } from "../utils/permissions";
import models from "../models";

export default {
  Query: {
    allUsers: requireAuth.createResolver((_, args, {  }) =>
      models.User.findAll()
    ),
    me: requireAuth.createResolver(async (_, args, {  user }) => {
      try {
        const loggedUser = await models.User.findOne({
          where: { id: user.id },
          raw: true
        });
        return {
          ...loggedUser
        };
      } catch (error) {
        console.log("error fetching user", error);

        throw error;
      }
    })
  },

  Mutation: {
    login: (_, args, { models, SECRET }) => authenticate(args, SECRET),
    register: async (_, args, { models }) => {
      try {
        const ok = await models.sequelize.transaction(async transaction => {
          const user = await models.User.create(args, { transaction });
          const channel = await models.Channel.create(
            { name: `${user.username}-${user.email}`, ownerId: user.id },
            { transaction }
          );
          await models.UserChannel.create(
            { memberId: user.id, channelId: channel.id },
            { transaction }
          );

          return true;
        });

        return {
          ok
        };
      } catch (err) {
        console.log("error signup", err);
        return {
          ok: false,
          errors: formatError(err, models)
        };
      }
    }
  }
};
