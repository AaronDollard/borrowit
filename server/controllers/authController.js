const db = require("../db");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

module.exports.handleLogin = (req, res) => {
    if (req.session.user && req.session.user.username) {
        res.json({ loggedIn: true, username: req.session.user.username, id: req.session.user.id, userid: req.session.user.userid })
    } else {
        res.json({ loggedIn: false })
    }
}

module.exports.attemptLogin = async (req, res) => {
    const potentialUser = await db.query(
        "SELECT id, username, passhashed, userid FROM users u WHERE u.username=$1",
        [req.body.username]
    );

    if (potentialUser.rowCount > 0) {
        const isPassCorrect = await bcrypt.compare(
            req.body.password,
            potentialUser.rows[0].passhashed
        );

        //Session information below
        if (isPassCorrect) {
            req.session.user = {
                username: req.body.username,
                id: potentialUser.rows[0].id,
                userid: potentialUser.rows[0].userid
            };
            res.json({ loggedIn: true, username: req.body.username, id: req.session.user.id, userid: req.session.user.userid });
        } else {
            res.json({ loggedIn: false, status: "Incorrect credentials!" })
        }

    } else {
        res.json({ loggedIn: false, status: "Incorrect credentials!" })
    }
}


module.exports.attemptSignUp = async (req, res) => {
    //Check for existing user
    const existingUser = await db.query(
        "SELECT username from users WHERE username=$1",
        [req.body.username]
    );

    //If no user is found do the below
    if (existingUser.rowCount === 0) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUserQuery = await db.query(
            "INSERT INTO users(username, passhashed, userid) values($1,$2,$3) RETURNING id, username, userid",
            [req.body.username, hashedPassword, uuidv4()],
            console.log("Entered into database")
        );
        req.session.user = {
            username: req.body.username,
            id: newUserQuery.rows[0].id,
            userid: newUserQuery.rows[0].userid
        }
        res.json({ loggedIn: true, username: req.body.username, id: req.session.user.id, userid: req.session.user.userid });
    } else {
        res.json({ loggedIn: false, status: "Username taken" });
    }
}