const { Pool } = require("pg");
require("dotenv").config();

const db = new Pool({
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    password: process.env.PGPASSWORD,
    user: process.env.PGUSER,
    port: process.env.PGPORT
});

module.exports = db;