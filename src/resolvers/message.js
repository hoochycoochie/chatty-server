import { withFilter } from "graphql-subscriptions";
import formatError from "../utils/formatError";
import {
  requireAuth,
  isChannelMember,
  requiresChannelAccess
} from "../utils/permissions";
import pubsub from "../pubsub";
import models from "../models";

const NEW_CHANNEL_MESSAGE = "NEW_CHANNEL_MESSAGE";
export default {
  Subscription: {
    newChannelMessage: {
      subscribe: requiresChannelAccess.createResolver(withFilter(
        () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
        (payload, args) => payload.channelId === args.channelId,
      )),
    }
  },

  Message: {
    owner: ({ authorId }, { _ }, context) =>
      models.User.findOne({ where: { id: authorId }, raw: true })
  },

  Query: {
    allMessages: requireAuth.createResolver(
      async (_, { channelId }, context) => {
        console.log(channelId, "channelsId");
        const messages = await models.Message.findAll(
          { where: { channelId }, order: [["created_at", "ASC"]] },
          { raw: true }
        );

        return messages;
      }
    )
  },
  Mutation: {
    createMessage: requireAuth.createResolver(
      async (_, { msg, channelId }, { user }) => {
        try {
          const authorized = await isChannelMember(user.id, channelId);

          if (!authorized) {
            return {
              ok: false,
              errors: [{ path: "name", message: "errorintern" }]
            };
          }
          const message = await models.Message.create({
            msg,
            authorId: user.id,
            channelId
          });

          pubsub.publish(NEW_CHANNEL_MESSAGE, {
            channelId,
            newChannelMessage: message.dataValues
          });
          return {
            ok: true
          };
        } catch (error) {
          console.log("error", error);
          return {
            ok: false,
            errors: formatError(error, models)
          };
        }
      }
    )
  }
};
