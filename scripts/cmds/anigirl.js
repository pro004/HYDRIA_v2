const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "anygirl",
    version: "1.0.0",
    hasPermission: 0,
    credits: "𝙈𝙧𝙏𝙤𝙢𝙓𝙭𝙓",
    description: "Random anime girl profile picture",
    commandCategory: "random-img",
    usages: "send message",
    cooldowns: 5,
  },

  onStart: async ({ api, event }) => {
    const messageText = "Anime profile for you\nTag: anime girl";
    const imageLinks = [
      "https://i.imgur.com/qHuv5H8.jpg",
      "https://i.imgur.com/atYmQt0.jpg",
      "https://i.imgur.com/Kuz4Owe.jpg",
      "https://i.imgur.com/L9u9Si8.jpg",
      "https://i.imgur.com/2oGBtMi.jpg",
      "https://i.imgur.com/MWihsUp.jpg",
      "https://i.imgur.com/dPDFYxJ.jpg",
      "https://i.imgur.com/AiuPHQK.jpg",
      "https://i.imgur.com/6jKbMGx.jpg",
      "https://i.imgur.com/H0oXAje.jpg",
      "https://i.imgur.com/kKKwXkX.jpg",
      "https://i.imgur.com/F5CLGkl.jpg",
      "https://i.imgur.com/HKm2LKH.jpg",
      "https://i.imgur.com/egaTOK5.jpg",
      "https://i.imgur.com/vLGyXHX.jpg",
      "https://i.imgur.com/HqJuhTj.jpg",
      "https://i.imgur.com/VE6KEwT.jpg",
      "https://i.imgur.com/JLC36Uu.jpg",
      "https://i.imgur.com/qqt3KI1.jpg",
      "https://i.imgur.com/yImrkax.jpg",
      "https://i.imgur.com/sLzPtky.jpg",
      "https://i.imgur.com/vfCigSS.jpg",
      "https://i.imgur.com/WYVQRp1.jpg",
      "https://i.imgur.com/Y1djOm5.jpg",
      "https://i.imgur.com/e0mPXD9.jpg",
    ];

    const imageUrl = imageLinks[Math.floor(Math.random() * imageLinks.length)];
    const imagePath = `${__dirname}/cache/anime_girl.jpg`;

    try {
      const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(imagePath, Buffer.from(response.data));

      api.sendMessage(
        { body: messageText, attachment: fs.createReadStream(imagePath) },
        event.threadID,
        () => fs.unlinkSync(imagePath),
        event.messageID
      );
    } catch (error) {
      api.sendMessage("❌ Failed to fetch anime image. Try again later!", event.threadID, event.messageID);
    }
  },
};