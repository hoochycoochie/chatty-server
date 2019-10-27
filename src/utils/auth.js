import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import models from "../models";

export const createTokens = async (user, secret) => {
  const createToken = jwt.sign(
    {
      user: { id: user.id, username: user.username }
    },
    secret
  );

  return [createToken];
};

export const login = async ({ email, password }, SECRET) => {
  const user = await models.User.findOne({ where: { email }, raw: true });
  if (!user) {
    return {
      ok: false,
      errors: [{ path: "email", message: "wrongemailorpassword" }]
    };
  }

  const passwordValidity = await bcrypt.compare(password, user.password);

  if (!passwordValidity) {
    return {
      ok: false,
      errors: [{ path: "password", message: "wrongpassword" }]
    };
  }

  const [token] = await createTokens(user, SECRET);

  return {
    ok: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      picture: user.picture
    }
  };
};
