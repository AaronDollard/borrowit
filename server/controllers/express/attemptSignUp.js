const db = require("../../db");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { jwtSign } = require("../jsonwebtoken/jwtAuth");
const nodemailer = require('nodemailer');

const attemptRegister = async (req, res) => {
    //Check for existing user
    const existingUser = await db.query(
        "SELECT username from users WHERE username=$1",
        [req.body.username]
    );

    //If no user is found do the below
    if (existingUser.rowCount === 0) {

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "borrowit400@gmail.com",
                pass: "Spidermancool18"
            }
        });

        const options = {
            from: "borrowit400@gmail.com",
            to: req.body.email,
            subject: "Borrowit Registration",
            html: `<h3> Hi ${req.body.username}, </h3>

            <p>Thank you for registering an account with Borrowit.</p>
            <p>We hope you enjoy borrowing and lending items with other users.</p>
            <p>We hope you enjoy saving money and our application.</p>
            
            <p>Cheers,</p>
            <p>The Borrowit Team</p>`
        };

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUserQuery = await db.query(
            "INSERT INTO users(username, passhashed, userid, userrole, profilepic, email, firstname, surname, home, socials, phone) values($1,$2,$3,$4,$5, $6, $7, $8, $9, $10, $11) RETURNING id, username, userid, userrole, profilepic, email, firstname, surname, home, socials, phone",
            [req.body.username, hashedPassword, uuidv4(), 'user', 'https://bit.ly/3Jeit5F', req.body.email, '', '', '', 'No linked socials..', ''],
            console.log("Entered into database"),
        );

        transporter.sendMail(options, function (err, information) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Sent: " + information.response)
        });

        jwtSign(
            {
                username: req.body.username,
                id: newUserQuery.rows[0].id,
                userid: newUserQuery.rows[0].userid,
                userrole: newUserQuery.rows[0].userrole,
                profilepic: newUserQuery.rows[0].profilepic,
                email: newUserQuery.rows[0].email,
                firstname: newUserQuery.rows[0].firstname,
                surname: newUserQuery.rows[0].surname,
                home: newUserQuery.rows[0].home,
                socials: newUserQuery.rows[0].socials,
                phone: newUserQuery.rows[0].phone
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