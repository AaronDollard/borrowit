const { jwtVerify } = require("../jsonwebtoken/jwtAuth");
require("dotenv").config();

const userAuthorized = (socket, next) => {
    const token = socket.handshake.auth.token;

    console.log(token)

    jwtVerify(token, process.env.JWT_SECRET)
        .then(decoded => {
            socket.user = { ...decoded };
            next();
        })
        .catch(error => {
            console.log("Bad Request!", error);
            next(new Error("Not Authorized"));
        });
};

module.exports = userAuthorized;