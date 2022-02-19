const redisClient = require("../../redis");

const addContact = async (socket, contactName, cb) => {
    console.log(contactName);
    if (contactName === socket.user.username) {
        cb({ done: false, errorMsg: "Cannot add yourself!" });
        return;
    }

    const contact = await redisClient.hgetall(`userid:${contactName}`);
    const currentContactList = await redisClient.lrange(`contacts:${socket.user.username}`, 0, -1);

    //prevent adding the same user
    if (currentContactList && currentContactList.indexOf(`${contactName}.${contact.userid}`) !== -1) {
        cb({ done: false, errorMsg: "Contact already added!" });
        return;
    };

    //Add borrower to contact list
    await redisClient.lpush(`contacts:${socket.user.username}`, [contactName, contact.userid].join("."));
    //add lender to borrowers list
    await redisClient.lpush(`contacts:${contactName}`, [socket.user.username, socket.user.userid].join("."));

    const newContact = {
        username: contactName,
        userid: contact.userid,
        connected: contact.connected
    }
    cb({ done: true, newContact });
};

module.exports = addContact;