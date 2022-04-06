const db = require("../../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { jwtSign } = require("../jsonwebtoken/jwtAuth");
require("dotenv").config();

const attemptLogin = async (req, res) => {
    console.log("Attempted Login - Backend");
    const potentialUser = await db.query(
        "SELECT id, username, passhashed, userid, userrole, profilepic, email, firstname, surname, home, socials, phone FROM users u WHERE u.username=$1",
        [req.body.username]
    );

    if (potentialUser.rowCount > 0) {
        const isPassCorrect = await bcrypt.compare(
            req.body.password,
            potentialUser.rows[0].passhashed
        );

        //Session information below
        if (isPassCorrect) {
            jwtSign(
                {
                    username: req.body.username,
                    id: potentialUser.rows[0].id,
                    userid: potentialUser.rows[0].userid,
                    userrole: potentialUser.rows[0].userrole,
                    profilepic: potentialUser.rows[0].profilepic,
                    email: potentialUser.rows[0].email,
                    firstname: potentialUser.rows[0].firstname,
                    surname: potentialUser.rows[0].surname,
                    home: potentialUser.rows[0].home,
                    socials: potentialUser.rows[0].socials,
                    phone: potentialUser.rows[0].phone
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
            res.json({ loggedIn: false, status: "Incorrect credentials!" })
        }

    } else {
        res.json({ loggedIn: false, status: "Incorrect credentials!" })
    }
}

module.exports = attemptLogin;