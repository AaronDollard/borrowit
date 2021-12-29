const db = require("../db");

//Add an item to the database linked to that users id
module.exports.addItem = async (req, res) => {
    try {
        const { name, description, condition, period, photo, giveaway, currentUser } = req.body;
        console.log(currentUser, "itemController addItem Debug");

        const newItem = await db.query
            ("INSERT INTO items ( itemname, descr, condition, lendlength, photo, giveaway, itemowner) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
                [name, description, condition, period, photo, giveaway, currentUser]
            );
        res.json(newItem.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
};

//get all of the currently available offers
module.exports.getItem = async (req, res) => {
    try {
        const getItems = await db.query("SELECT i.*, users.username FROM items as i LEFT JOIN users ON users.userid = i.itemowner");
        for (var i = 0; i < getItems.rows.length; i++) {
            var row = getItems.rows[i];
        }
        res.json(getItems.rows);
    } catch (err) {
        console.error(err.message);
    }
};