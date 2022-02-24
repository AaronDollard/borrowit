const attemptSignUp = require("../controllers/express/attemptSignUp");
const attemptSignIn = require("../controllers/express/attemptSignIn");
const handleLogin = require("../controllers/express/handleLogin");

module.exports = {
    attemptSignUp,
    attemptSignIn,
    handleLogin,
};