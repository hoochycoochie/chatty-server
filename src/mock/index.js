import faker from "faker";

import models from "../models";

const USERS_TOTAL = 3;

export default async () => {
  try {
    await models.Message.destroy({ truncate: true, cascade: true });
    await models.User.destroy({ truncate: true, cascade: true });
    await models.Channel.destroy({ truncate: true, cascade: true });
    await models.UserChannel.destroy({ truncate: true, cascade: true });

    await Array.from({ length: USERS_TOTAL }).forEach(async (_, i) => {
      const user = await models.User.create({
        username: "membre "+i,
        password: "amadou",
        email: faker.internet.email(),
        picture: `https://randomuser.me/api/portraits/women/${i}.jpg`
      });

      const channel = await models.Channel.create({
        name: "channel" + i,
        ownerId: user.id
      });

      await models.UserChannel.create({
        memberId: user.id,
        channelId: channel.id
      });

      console.log("faker.lorem.paragraph", faker.lorem.text());
      await models.Message.create({
        text: faker.lorem.text(),
        url: `https://randomuser.me/api/portraits/women/${i}.jpg`,
        filetype: "jpg",
        channelId: channel.id
      });
    });
  } catch (error) {
    console.log("error=============",error.message)
    throw error;
  }
};
