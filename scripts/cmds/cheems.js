
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");

module.exports = {
  config: {
    name: "cheems",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Bảo Luân",
    description: "Oh is that Cheem",
    commandCategory: "Edit-IMG",
    usages: "[text 1] | [text 2] | [text 3] | [text 4]",
    cooldowns: 1,
  },

  wrapText: async (ctx, text, maxWidth) => {
    if (ctx.measureText(text).width < maxWidth) return [text];
    if (ctx.measureText("W").width > maxWidth) return null;

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
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
      else {
        lines.push(line.trim());
        line = "";
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return lines;
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const fontPath = path.join(__dirname, "/cache/SVN-Arial 2.ttf");
    const imagePath = path.join(__dirname, "/cache/cheems.png");
    const fontUrl = "https://drive.google.com/u/0/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download";
    const imageUrl = "https://i.imgur.com/KkM47H9.png";

    try {
      // Download Cheems image
      const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(imagePath, Buffer.from(imageResponse.data));

      // Download font if not exists
      if (!fs.existsSync(fontPath)) {
        const fontResponse = await axios.get(fontUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(fontPath, Buffer.from(fontResponse.data));
      }

      // Load image and set up canvas
      const baseImage = await loadImage(imagePath);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      registerFont(fontPath, { family: "SVN-Arial 2" });

      ctx.font = "30px SVN-Arial 2";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";

      // Process and draw text
      const text = args.join(" ").trim().replace(/\s+\|/g, "|").replace(/\|\s+/g, "|").split("|");
      const positions = [90, 240, 370, 500];

      for (let i = 0; i < text.length && i < positions.length; i++) {
        const lines = await this.wrapText(ctx, text[i], 464);
        ctx.fillText(lines.join("\n"), 330, positions[i]);
      }

      // Save edited image
      fs.writeFileSync(imagePath, canvas.toBuffer());

      // Send image and delete cache
      return api.sendMessage(
        { attachment: fs.createReadStream(imagePath) },
        threadID,
        () => fs.unlinkSync(imagePath),
        messageID
      );
    } catch (error) {
      api.sendMessage("❌ Failed to generate Cheems image. Try again later!", threadID, messageID);
    }
  },
};