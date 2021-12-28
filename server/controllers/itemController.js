const db = require("../db");

module.exports.addItem = async (req, res) => {
    try {
        const { name, description, condition, period, photo, giveaway, currentUser } = req.body;
        console.log(currentUser, "itemController Debug");

        const newItem = await db.query
            ("INSERT INTO items ( itemname, descr, condition, lendlength, photo, giveaway, userid) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
                [name, description, condition, period, photo, giveaway, currentUser]
            );
        res.json(newItem.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
}