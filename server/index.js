require("dotenv").config();
const port = process.env.PORT || 4000
const express = require("express");
const { corsConfig } = require("./controllers/serverController");
const { Server } = require("socket.io");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const authRouter = require("./routers/authRouter");
const { userAuthorized, addContact, initializeUser, onDisconnect, dm } = require("./controllers/socketController");
const server = require("http").createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

//Middleware
app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());

//Route below are used for authentication
app.use("/auth", authRouter);
app.set("trust proxy", 1);


io.use(userAuthorized);
io.on("connect", socket => {
    initializeUser(socket);

    socket.on("add_contact", (contactName, cb) => {
        addContact(socket, contactName, cb)
    });

    socket.on("dm", message => dm(socket, message));

    socket.on("disconnecting", () => onDisconnect(socket));
})

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})