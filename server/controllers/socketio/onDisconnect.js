const redisClient = require("../../redis");
const parseContactList = require("./parseContactList");

const onDisconnect = async socket => {
    await redisClient.hset(
        `userid:${socket.user.username}`,
        "connected", false
    );
    const contactList = await redisClient.lrange(`contacts:${socket.user.username}`, 0, -1)
    const contactRooms = await parseContactList(contactList).then(contacts =>
        contacts.map(contact => contact.userid)
    );
    socket.to(contactRooms).emit("connected", false, socket.user.username);
};

module.exports = onDisconnect;