const fs = require('fs');
const request = require('request');

module.exports.config = {
  name: "groupinfo",
  version: "1.5",
  author: "XROTICK",
  countDown: 5,
  role: 1, 
  description: "View your group information",
  category: "Box",
  usages: "groupinfo",
  guide: "{pn} groupinfo", // Command guide
  priority: 1
};


module.exports.onStart = function () {
  console.log("Groupinfo command has been initialized!");
};

module.exports.onStart = async function ({ api, event, args }) {
  try {
    // Fetch thread info using api.getThreadInfo
    let threadInfo = await api.getThreadInfo(event.threadID);
    const memLength = threadInfo.participantIDs.length;
    let threadMem = memLength;
    let genderNam = [];
    let genderNu = [];
    let nope = [];
  
    // Process the participants and categorize them by gender
    for (let z in threadInfo.userInfo) {
      const gender = threadInfo.userInfo[z].gender;
      const name = threadInfo.userInfo[z].name;
      if (gender === "MALE") genderNam.push(z + gender);
      else if (gender === "FEMALE") genderNu.push(gender);
      else nope.push(name);
    }
  
    const nam = genderNam.length;
    const nu = genderNu.length;
    const qtv = threadInfo.adminIDs.length;
    const sl = threadInfo.messageCount;
    const u = threadInfo.nicknames;
    const icon = threadInfo.emoji;
    const threadName = threadInfo.threadName;
    const id = threadInfo.threadID;
    const sex = threadInfo.approvalMode;
    
    // Approval mode status handling
    const pd = sex === false ? 'Turned off' : sex === true ? 'Turned on' : 'Unknown';
  
    // Send the formatted message
    const callback = () => {
      api.sendMessage(
        {
          body: `🔧 GC Name: ${threadName}\n🔧 Group ID: ${id}\n🔧 Approval: ${pd}\n🔧 Emoji: ${icon}\n🔧 Information: Including ${threadMem} members\n🔧 Number of males: ${nam} members\n🔧 Number of females: ${nu} members\n🔧 With ${qtv} administrators\n🔧 Total number of messages: ${sl} msgs.\n\nMade with ❤️ by: XROTICK`,
          attachment: fs.createReadStream(__dirname + '/cache/1.png')
        },
        event.threadID,
        () => fs.unlinkSync(__dirname + '/cache/1.png'),
        event.messageID
      );
    };
  
    // Download group image and send
    return request(encodeURI(`${threadInfo.imageSrc}`))
      .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
      .on('close', callback);
  } catch (error) {
    console.error('Error fetching thread info:', error);
    api.sendMessage('An error occurred while fetching the group information.', event.threadID);
  }
};