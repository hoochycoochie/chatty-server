import bcrypt from "bcrypt";

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "member",
    {
      username: {
        type: DataTypes.STRING,
        validate: {
          // isAlphanumeric: {
          //   args: true,
          //   msg: "alphanumericusername"
          // },
          len: {
            args: [2, 30],
            msg: "usernamelenght2_30"
          }
        }
      },

      password: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [6, 30],
            msg: "passwordlength6_30"
          }
        }
      },
      picture: {
        type: DataTypes.STRING,
        defaultValue:
          "https://www.senegp.com/uploads/924731c58242b4bf2ee0b178f9507a0b.jpg"
      },
      email: {
        type: DataTypes.STRING,
        unique: { args: true, msg: "emailUnique" },
        validate: {
          isEmail: {
            args: true,
            msg: "invalidemail"
          }
        }
      },
      roles: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: ["user"]
      }
    },
    {
      hooks: {
        afterValidate: async (user, _) => {
          user.password = await bcrypt.hash(user.password, 12);
        }
      }
    }
  );

  User.associate = models => {
    // N:M
    User.belongsToMany(models.Channel, {
      through: models.UserChannel,
      foreignKey: {
        name: "memberId",
        field: "member_id"
      }
    });
  };

  return User;
};
