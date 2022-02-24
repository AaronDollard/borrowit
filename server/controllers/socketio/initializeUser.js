
const redisClient = require("../../redis");
const parseContactList = require("./parseContactList");

const initializeUser = async socket => {
    //socket.user = { ...socket.request.session.user };
    socket.join(socket.user.userid);
    await redisClient.hset(
        `userid:${socket.user.username}`,
        "userid", socket.user.userid,
        "connected", true,
    );

    const contactList = await redisClient.lrange(`contacts:${socket.user.username}`, 0, -1);
    const parsedContactList = await parseContactList(contactList);
    const contactRooms = parsedContactList.map(contact => contact.userid);

    if (contactRooms.length > 0) {
        socket.to(contactRooms).emit("connected", true, socket.user.username);
    }
    console.log(`${socket.user.username} contacts:`, parsedContactList);
    socket.emit("contacts", parsedContactList);


    //message storing history
    const msgQuery = await redisClient.lrange(
        `chat:${socket.user.userid}`,
        0,
        -1
    );

    // to.from.content
    const messages = msgQuery.map(msgStr => {
        const parsedStr = msgStr.split(".");
        return { to: parsedStr[0], from: parsedStr[1], content: parsedStr[2] };
    });

    if (messages && messages.length > 0) {
        socket.emit("messages", messages);
    }
};


module.exports = initializeUser;