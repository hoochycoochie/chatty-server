import formatError from "../utils/formatError";
import { requireAuth } from "../utils/permissions";
import models from "../models";

export default {
  Query: {
    allChannels: requireAuth.createResolver((_, args, { user }) =>
      models.Channel.findAll({ where: { ownerId: user.id } }, { raw: true })
    ),
    inviteChannels: requireAuth.createResolver(
      async (_, args, {  user }) => {
        try {
          const userChannels = await models.UserChannel.findAll(
            { where: { memberId: user.id } },
            { raw: true }
          );
          const userIds = userChannels.map(m => m.channelId);
          const channels = await models.Channel.findAll(
            { where: { id: userIds } },
            { raw: true }
          );
          return channels;
        } catch (error) {
          throw error;
        }
      }
    )
  },

  Mutation: {
    addChannelMember: requireAuth.createResolver(
      async (_, { email, channelId }, { user }) => {
        try {
          const channelPromise = models.Channel.findOne(
            {
              where: { id: channelId, ownerId: user.id }
            },
            { raw: true }
          );

          const userToAddPromise = models.User.findOne(
            { where: { email } },
            { raw: true }
          );

          const [channel, userToAdd] = await Promise.all([
            channelPromise,
            userToAddPromise
          ]);

          if (!userToAdd) {
            return {
              ok: false,
              errors: [{ path: "email", message: "unknowneruser" }]
            };
          }
          if (!channel) {
            return {
              ok: false,
              errors: [{ path: "email", message: "notChannelOwner" }]
            };
          }
          const member = await models.UserChannel.findOne(
            { where: { memberId: userToAdd.id, channelId: channel.id } },
            { raw: true }
          );

          if (member) {
            return {
              ok: false,
              errors: [{ path: "email", message: "memberalreadyinchannel" }]
            };
          }

          await models.UserChannel.create({
            memberId: userToAdd.id,
            channelId: channel.id
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
    ),
    createChannel: requireAuth.createResolver(
      async (_, { name, public: publiq }, { user }) => {
        try {
          const channel = await models.sequelize.transaction(
            async transaction => {
              const channel = await models.Channel.create(
                { name, ownerId: user.id, public: publiq },
                { transaction }
              );
              await models.UserChannel.create(
                { memberId: user.id, channelId: channel.id },
                { transaction }
              );

              return channel;
            }
          );

          return {
            ok: true,
            channel
          };
        } catch (err) {
          return {
            ok: false,
            errors: formatError(err, models)
          };
        }
      }
    )
  }
};
