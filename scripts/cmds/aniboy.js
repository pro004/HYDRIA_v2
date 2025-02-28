const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports = {
  config: {
    name: "aniboy",
    version: "1.0.0",
    hasPermission: 0,
    credits: "𝙈𝙧𝙏𝙤𝙢𝙓𝙭𝙓",
    description: "Random anime profile picture",
    commandCategory: "random-img",
    usages: "send message",
    cooldowns: 5,
  },

  onStart: async ({ api, event }) => {
    const imageLinks = [
      "https://i.imgur.com/x6Cc9n6.jpg",
      "https://i.imgur.com/Jmb7V7h.jpg",
      "https://i.imgur.com/5trZsRg.jpg",
      "https://i.imgur.com/IzwQVwj.jpg",
      "https://i.imgur.com/8AOyfUj.jpg",
      "https://i.imgur.com/hJGZwyj.jpg",
      "https://i.imgur.com/QU1MKQd.jpg",
      "https://i.imgur.com/0frgNtL.jpg",
      "https://i.imgur.com/6v29Hz8.jpg",
      "https://i.imgur.com/RFwkQMI.jpg",
      "https://i.imgur.com/5QnAGFH.jpg",
      "https://i.imgur.com/G7SGPWI.jpg",
      "https://i.imgur.com/NuEQzfl.jpg",
      "https://i.imgur.com/zw53mfy.jpg",
      "https://i.imgur.com/GjG1tBz.jpg",
      "https://i.imgur.com/Mu8Y0vR.jpg",
      "https://i.imgur.com/VxEFxz6.jpg",
      "https://i.imgur.com/s8lysbe.jpg",
      "https://i.imgur.com/UqDJlIu.png",
      "https://i.imgur.com/PxiKaff.jpg",
      "https://i.imgur.com/SpW8Eq0.jpg",
      "https://i.imgur.com/vQ104Wa.jpg",
      "https://i.imgur.com/S1vyler.jpg",
      "https://i.imgur.com/UvHNwPB.jpg",
      "https://i.imgur.com/DKUxCGa.jpg",
    ];

    const imageUrl = imageLinks[Math.floor(Math.random() * imageLinks.length)];
    const imagePath = `${__dirname}/cache/anime.jpg`;

    try {
      const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(imagePath, Buffer.from(response.data));

      api.sendMessage(
        { body: "Anime profile for you\nTag: Anime Blur", attachment: fs.createReadStream(imagePath) },
        event.threadID,
        () => fs.unlinkSync(imagePath),
        event.messageID
      );
    } catch (error) {
      api.sendMessage("❌ Failed to fetch anime image. Try again later!", event.threadID, event.messageID);
    }
  },
};