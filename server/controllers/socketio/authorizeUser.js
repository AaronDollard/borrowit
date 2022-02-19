// const { jwtVerify } = require("../jwt/jwtAuth");
// require("dotenv").config();

// const authorizeUser = (socket, next) => {
//   const token = socket.handshake.auth.token;

//   jwtVerify(token, process.env.JWT_SECRET)
//     .then(decoded => {
//       socket.user = { ...decoded };
//       next();
//     })
//     .catch(err => {
//       console.log("Bad request!", err);
//       next(new Error("Not authorized"));
//     });
// };

const authorizeUser = (socket, next) => {
    if (!socket.request.session || !socket.request.session.user) {
        console.log("Bad request");
        next(new Error("Not authorized!"));
    } else {
        socket.user = { ...socket.request.session.user };
        redisClient.hset(
            `userid:${socket.user.username}`,
            "userid", socket.user.userid)
        console.log("socket is working - hello")
        console.log("UserID: ", socket.user.userid)
        console.log(socket.id)
        console.log(socket.request.session.user.username)
        next();
    }
};

module.exports = authorizeUser;