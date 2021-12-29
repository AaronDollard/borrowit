const express = require("express");
const { sessionMiddleware, wrap, corsConfig } = require("./controllers/serverController");
const { Server } = require("socket.io");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const authRouter = require("./routers/authRouter");
const { userAuthorized } = require("./controllers/socketController");
const server = require("http").createServer(app);
require("dotenv").config();
const io = new Server(server, {
    cors: corsConfig
});

//Middleware
app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());
app.use(sessionMiddleware);

//Route below are used for authentication
app.use("/auth", authRouter)

io.use(wrap(sessionMiddleware))
io.use(userAuthorized);
io.on("connect", socket => {
    console.log("socket is working - hello")
    console.log("UserID: ", socket.user.userid)
    console.log(socket.id)
    console.log(socket.request.session.user.username)
})

server.listen(4000, () => {
    console.log("Server listening on port 4000")
})