const userAuthorized = require("./socketio/userAuthorized");
const initializeUser = require("./socketio/initializeUser");
const addContact = require("./socketio/addContact");
const onDisconnect = require("./socketio/onDisconnect");
const dm = require("./socketio/dm");

module.exports = {
    addContact,
    userAuthorized,
    initializeUser,
    onDisconnect,
    dm,
};