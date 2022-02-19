const redisClient = require("../redis");
require("dotenv").config();
const session = require("express-session");
const ReditStore = require("connect-redis")(session);

const sessionMiddleware = session({
    secret: process.env.COOKIE_SECRET,
    credentials: true,
    name: "sid",
    store: new ReditStore({ client: redisClient }), //Used for storing user sessions across multiple sessions
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production" ? "true" : "auto",
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        expires: 1000 * 60 * 60 * 60 * 24 //expires in 1 day
    }
})

const wrap = (expressMiddleware) => (socket, next) =>
    expressMiddleware(socket.request, {}, next);

const corsConfig = {
    origin: process.env.CLIENT_URL,
    credentials: true,
}

module.exports = { sessionMiddleware, wrap, corsConfig }