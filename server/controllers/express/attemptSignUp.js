const db = require("../../db");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { jwtSign } = require("../jsonwebtoken/jwtAuth");

const attemptRegister = async (req, res) => {
    //Check for existing user
    const existingUser = await db.query(
        "SELECT username from users WHERE username=$1",
        [req.body.username]
    );

    //If no user is found do the below
    if (existingUser.rowCount === 0) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUserQuery = await db.query(
            "INSERT INTO users(username, passhashed, userid, userrole) values($1,$2,$3,$4) RETURNING id, username, userid, userrole",
            [req.body.username, hashedPassword, uuidv4(), 'user'],
            console.log("Entered into database")
        );
        jwtSign(
            {
                username: req.body.username,
                id: newUserQuery.rows[0].id,
                userid: newUserQuery.rows[0].userid,
                userrole: newUserQuery.rows[0].userrole
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" },
        )
            .then(token => {
                res.json({ loggedIn: true, token });
            })
            .catch(err => {
                console.log(err);
                res.json({ loggedIn: false, status: "Try again later" });
            });
    } else {
        res.json({ loggedIn: false, status: "Username taken" });
    }
}

module.exports = attemptRegister;