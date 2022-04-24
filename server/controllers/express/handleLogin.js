const { jwtVerify, getJwt } = require("../jsonwebtoken/jwtAuth");
const db = require("../../db");
require("dotenv").config();

const handleLogin = async (req, res) => {
    const token = getJwt(req);

    if (!token) {
        res.json({ loggedIn: false });
        return;
    }

    jwtVerify(token, process.env.JWT_SECRET)
        .then(async decoded => {
            const potentialUser = await db.query(
                `SELECT username, userrole, profilepic, email, firstname, surname, home, socials, phone
                FROM users u WHERE u.username = $1`,
                [decoded.username, decoded.userid, decoded.userrole, decoded.profilepic, decoded.email, decoded.firstname, decoded.surname, decoded.home, decoded.socials, decoded.phone]
            );

            if (potentialUser.rowCount === 0) {
                res.json({ loggedIn: false, token: null });
                return;
            }


            username = decoded.username
            userid = decoded.userid
            userrole = decoded.userrole
            profilepic = decoded.profilepic
            email = decoded.email
            firstname = decoded.firstname
            surname = decoded.surname
            home = decoded.home
            socials = decoded.socials
            phone = decoded.phone

            res.json({ loggedIn: true, token, userid, username, userrole, profilepic, email, firstname, surname, home, socials, phone });
        })
        .catch(() => {
            res.json({ loggedIn: false });
        });
};

module.exports = handleLogin;