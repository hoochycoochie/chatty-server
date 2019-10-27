import models from "../models";

const createResolver = resolver => {
  const baseResolver = resolver;
  baseResolver.createResolver = childResolver => {
    const newResolver = async (parent, args, context, info) => {
      await resolver(parent, args, context, info);
      return childResolver(parent, args, context, info);
    };
    return createResolver(newResolver);
  };
  return baseResolver;
};

// requiresAuth
export const requireAuth = createResolver((parent, args, { user }) => {
  if (!user || !user.id) {
    throw new Error("Not authenticated");
  }
});

// requiresAuth Admin
export const requireAdmin = requireAuth.createResolver(
  (parent, args, { user }) => {
    if (user.roles.indexOf("admin") > -1) {
      throw new Error("not authorized");
    }
  }
);
// is user member of channel
export const isChannelMember = async (memberId, channelId) => {
  const userChannel = await models.UserChannel.findOne(
    { where: { memberId, channelId } },
    { raw: true }
  );
  if (!userChannel) {
    return false;
  } else {
    return true;
  }
};

export const requiresChannelAccess = createResolver(
  async (parent, { channelId }, context) => {
    

    const { user } = context;
   
    if (!user || !user.id) {
      throw new Error("Not authenticated");
    }
    
    const channel = await models.Channel.findOne({ where: { id: channelId } });
    const member = await models.UserChannel.findOne({
      where: { channelId: channel.id, memberId: user.id }
    });
    if (!member) {
      throw new Error("notchannelmember");
    }
  }
);

export const directMessageSubscription = createResolver(
  async (parent, { teamId, userId }, { user, models }) => {
    if (!user || !user.id) {
      throw new Error("Not authenticated");
    }

    const members = await models.Member.findAll({
      where: {
        teamId,
        [models.sequelize.Op.or]: [{ userId }, { userId: user.id }]
      }
    });

    if (members.length !== 2) {
      throw new Error("Something went wrong");
    }
  }
);
