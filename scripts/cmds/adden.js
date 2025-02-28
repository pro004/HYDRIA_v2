const axios = require("axios");
const fs = require("fs-extra");
const { loadImage, createCanvas, registerFont } = require("canvas");
const request = require("request");

module.exports = {
  config: {
    name: "daden",
    version: "1.0.0",
    hasPermission: 0,
    credits: "𝙈𝙧𝙏𝙤𝙢𝙓𝙭𝙓",
    description: "White brother :v",
    commandCategory: "banner",
    usages: "[text 1] | [text 2]",
    cooldowns: 10,
  },

  wrapText: (ctx, text, maxWidth) => {
    return new Promise((resolve) => {
      if (ctx.measureText(text).width < maxWidth) return resolve([text]);
      if (ctx.measureText("W").width > maxWidth) return resolve(null);
      const words = text.split(" ");
      const lines = [];
      let line = "";

      while (words.length > 0) {
        let split = false;
        while (ctx.measureText(words[0]).width >= maxWidth) {
          const temp = words[0];
          words[0] = temp.slice(0, -1);
          if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
          else {
            split = true;
            words.splice(1, 0, temp.slice(-1));
          }
        }
        if (ctx.measureText(`${line}${words[0]}`).width < maxWidth)
          line += `${words.shift()} `;
        else {
          lines.push(line.trim());
          line = "";
        }
        if (words.length === 0) lines.push(line.trim());
      }
      return resolve(lines);
    });
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const pathImg = `${__dirname}/cache/anhdaden.png`;
    const fontPath = `${__dirname}/cache/SVN-Arial 2.ttf`;
    const text = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|");

    // Download image
    const getImage = (await axios.get("https://i.imgur.com/2ggq8wM.png", { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathImg, Buffer.from(getImage));

    // Download font if not exists
    if (!fs.existsSync(fontPath)) {
      const getFont = (await axios.get("https://drive.google.com/u/0/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download", { responseType: "arraybuffer" })).data;
      fs.writeFileSync(fontPath, Buffer.from(getFont));
    }

    // Load base image
    const baseImage = await loadImage(pathImg);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    // Draw image
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // Register font and set text properties
    registerFont(fontPath, { family: "SVN-Arial 2" });
    ctx.font = "30px SVN-Arial 2";
    ctx.fillStyle = "#000077";
    ctx.textAlign = "center";

    // Wrap and draw text
    const line1 = await this.wrapText(ctx, text[0] || "", 464);
    const line2 = await this.wrapText(ctx, text[1] || "", 464);
    ctx.fillText(line1.join("\n"), 170, 129);
    ctx.fillText(line2.join("\n"), 170, 440);

    // Save and send image
    fs.writeFileSync(pathImg, canvas.toBuffer());
    api.sendMessage({ attachment: fs.createReadStream(pathImg) }, threadID, () => fs.unlinkSync(pathImg), messageID);
  },
};