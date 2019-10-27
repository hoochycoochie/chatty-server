export default (sequelize, DataTypes) => {
  const PrivateMessage = sequelize.define("private_message", {
    text: DataTypes.TEXT,
    url: DataTypes.STRING,
    filetype: DataTypes.STRING
  });

  PrivateMessage.associate = models => {
    PrivateMessage.belongsTo(models.User, {
      foreignKey: {
        name: "senderId",
        field: "sender_id"
      }
    });

    PrivateMessage.belongsTo(models.User, {
      foreignKey: {
        name: "receiverId",
        field: "receiver_id"
      }
    });
  };

  return PrivateMessage;
};
