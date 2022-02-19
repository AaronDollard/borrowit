
const redisClient = require("../../redis");

const parseContactList = async (contactList) => {
  const newContactList = [];
  for (let contact of contactList) {
    const parsedContact = contact.split(".");
    const contactConnected = await redisClient.hget(
      `userid:${parsedContact[0]}`,
      "connected"
    );
    newContactList.push({
      username: parsedContact[0],
      userid: parsedContact[1],
      connected: contactConnected,
    });
  };
  return newContactList;
};

module.exports = parseContactList;