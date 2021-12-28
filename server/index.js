const express = require("express");
const helmet = require("helmet");
const { Server } = require("socket.io");
const app = express();
const cors = require("cors");
const authRouter = require("./routers/authRouter");
const session = require("express-session");
const Redis = require("ioredis");
const ReditStore = require("connect-redis")(session)
require("dotenv").config();
const server = require("http").createServer(app);


const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: "true",
    },
});

//Middleware
const redisClient = new Redis();
app.use(helmet());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(express.json());
app.use(session({
    secret: process.env.COOKIE_SECRET,
    credentials: true,
    name: "sid",
    store: new ReditStore({ client: redisClient }), //Used for storing user sessions across multiple sessions
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.ENVIRONMENT === "production",
        httpOnly: true,
        sameSite: process.env.ENVIRONMENT === "production" ? "none" : "lax",
        expires: 1000 * 60 * 60 * 60 * 24 //expires in 1 day
    }
})
)

//Route below are used for authentication
app.use("/auth", authRouter)
app.get("/", (req, res) => {
    //res.json("hi");
});



io.on("connect", socket => { })

server.listen(4000, () => {
    console.log("Server listening on port 4000")
})