export default (sequelize, DataTypes) => {
  const Message = sequelize.define("message", {
    msg: DataTypes.TEXT,
    url: DataTypes.STRING,
    filetype: DataTypes.STRING
  });

  Message.associate = models => {
    // 1:M
    // Message.belongsTo(models.Channel, {
    //   foreignKey: {
    //     name: "channelId",
    //     field: "channel_id"
    //   }
    // });
    Message.belongsTo(models.User, {
      foreignKey: {
        name: "authorId",
        field: "author_id"
      }
    });
  };

  return Message;
};
