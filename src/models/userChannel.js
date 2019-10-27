export default sequelize => {
  const UserChannel = sequelize.define("user_channel", {});

  return UserChannel;
};
