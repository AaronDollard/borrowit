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
                user: process.env.GOOGLE_USER,
                pass: process.env.GOOGLE_PASSWORD
            }
        });

        const options = {
            from: "borrowit400@gmail.com",
            to: req.body.email,
            subject: "Borrowit Registration",
            html: `<!DOCTYPE html>
            <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width,initial-scale=1">
              <meta name="x-apple-disable-message-reformatting">
              <title></title>
              <!--[if mso]>
              <noscript>
                <xml>
                  <o:OfficeDocumentSettings>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                  </o:OfficeDocumentSettings>
                </xml>
              </noscript>
              <![endif]-->
              <style>
                table, td, div, h1, p {font-family: Arial, sans-serif;}
              </style>
            </head>
            <body style="margin:0;padding:0;">
              <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
                <tr>
                  <td align="center" style="padding:0;">
                    <table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
                      <tr>
                        <td align="center" style="padding:40px 0 30px 0;background:#ffffff;">
                          <img src="https://s00152905-project1.s3.eu-west-1.amazonaws.com/logo.png" alt="" width="300" style="height:auto;display:block;" />
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:36px 30px 42px 30px;">
                          <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                            <tr>
                              <td style="padding:0 0 36px 0;color:#153643;">
                                <h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;">Welcome to Borrowit ${req.body.username}</h1>
                                <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">We hope you enjoy borrowing and lending items with other users and saving money and the planet in the process.</p>
                                <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">Please note however, Borrowit has full authority over the any items information you upload. If the items you upload are deemed unacceptable or harmful to others, Borrowit reserves the right to delete or alter the information that you provide on the item/items in question. With that out of the way, we wish for you to enjoy our free service and have fun lending and borrowing with like minded people.</p>
                                <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">With that out of the way, we wish for you to enjoy our free service and have fun lending and borrowing with like minded people.</p>
                                <p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><a href="https://borrowit.netlify.app" style="color:#1b846d;text-decoration:underline;">Begin borrowing and lending!</a></p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:30px;background:#1b846d;">
                          <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;">
                            <tr>
                              <td style="padding:0;width:50%;" align="left">
                                <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#ffffff;">
                                  &reg; Borrowit Team 2022<br/>
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>`
        };


        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUserQuery = await db.query(
            "INSERT INTO users(username, passhashed, userid, userrole, profilepic, email, firstname, surname, home, socials, phone) values($1,$2,$3,$4,$5, $6, $7, $8, $9, $10, $11) RETURNING username, userid, userrole, profilepic, email, firstname, surname, home, socials, phone",
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