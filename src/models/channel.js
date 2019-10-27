export default (sequelize, DataTypes) => {
  const Channel = sequelize.define("channel", {
    name: {
      type: DataTypes.STRING,
      unique: { args: true, msg: "channelnameUnique" }
    },
    public: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

  Channel.associate = models => {
    Channel.hasMany(models.Message, {
      foreignKey: {
        name: "channelId",
        field: "channel_id"
      }
    });
    // 1:M
    Channel.belongsTo(models.User, {
      foreignKey: {
        name: "ownerId",
        field: "owner_id"
      }
    });
    // N:M
    Channel.belongsToMany(models.User, {
      through: models.UserChannel,
      foreignKey: {
        name: "channelId",
        field: "channel_id"
      }
    });
  };

  return Channel;
};
