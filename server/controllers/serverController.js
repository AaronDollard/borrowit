require("dotenv").config();

const corsConfig = {
    origin: "*",
    credentials: true,
}

module.exports = { corsConfig }