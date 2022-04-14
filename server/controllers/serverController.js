require("dotenv").config();

const corsConfig = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST"]
}

module.exports = { corsConfig }