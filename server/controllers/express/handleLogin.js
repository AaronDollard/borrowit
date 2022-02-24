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
                "SELECT username FROM users u WHERE u.username = $1",
                [decoded.username]
            );

            if (potentialUser.rowCount === 0) {
                res.json({ loggedIn: false, token: null });
                return;
            }

            username = decoded.username,
                userid = decoded.userid,

                res.json({ loggedIn: true, token, userid, username });
        })
        .catch(() => {
            res.json({ loggedIn: false });
        });
};

module.exports = handleLogin;