const db = require("../db");
const bcrypt = require("bcrypt");

module.exports.handleLogin = (req, res) => {
    if (req.session.user && req.session.user.username) {
        res.json({ loggedIn: true, username: req.session.username })
    } else {
        res.json({ loggedIn: false })
    }
}

module.exports.attemptLogin = async (req, res) => {
    const potentialUser = await db.query(
        "SELECT id, username, passhashed FROM users u WHERE u.username=$1",
        [req.body.username]
    );

    if (potentialUser.rowCount > 0) {
        const isPassCorrect = await bcrypt.compare(
            req.body.password,
            potentialUser.rows[0].passhashed
        );

        if (isPassCorrect) {
            req.session.user = {
                username: req.body.username,
                id: potentialUser.rows[0].id,
            };

            res.json({ loggedIn: true, username: req.body.username });
        } else {
            res.json({ loggedIn: false, status: "Incorrect credentials!" })
        }

    } else {
        res.json({ loggedIn: false, status: "Incorrect credentials!" })
    }
}


module.exports.attemptSignUp = async (req, res) => {
    validateForm(req, res);

    //Check for existing user
    const existingUser = await db.query(
        "SELECT username from users WHERE username=$1",
        [req.body.username]
    );

    //If no user is found do the below
    if (existingUser.rowCount === 0) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUserQuery = await db.query(
            "INSERT INTO users(username, passhashed) values($1,$2) RETURNING id, username",
            [req.body.username, hashedPassword],
            console.log("Entered into database")
        );
        req.session.user = {
            username: req.body.username,
            id: newUserQuery.rows[0].id,
        }
        res.json({ loggedIn: true, username: req.body.username });
    } else {
        res.json({ loggedIn: false, status: "Username taken" });
    }
}