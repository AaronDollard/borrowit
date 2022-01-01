const db = require("../db");

//Add an item to the database linked to that users id
module.exports.addItem = async (req, res) => {
    try {
        const { name, description, condition, period, photo, giveaway, currentUserID } = req.body;
        console.log(currentUserID, "itemController addItem Debug");
        const imageAlt = "A photo has not yet been added for this item";
        var dbimage = "";
        var itemaway = ";"

        if (photo == "Link to photo") {
            dbimage = "https://bit.ly/3HcjfiW"
        } else dbimage = photo

        if (giveaway == true) {
            itemaway = "Keep"
        } else itemaway = "Borrow"

        const newItem = await db.query
            ("INSERT INTO items ( itemname, descr, condition, lendlength, photo, giveaway, itemowner, imageAlt) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
                [name, description, condition, period, dbimage, itemaway, currentUserID, imageAlt]
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

//get all for certain user
module.exports.getLoggedUserItems = async (req, res) => {
    try {
        console.log("GetUserLoggedItems - itemController Debug");
        const { currentUserID } = req.body;

        const getLoggedUserItems = await db.query
            ("SELECT * FROM items as i WHERE i.itemowner = $1",
                [currentUserID])
            ;
        for (var i = 0; i < getLoggedUserItems.rows.length; i++) {
            var row = getLoggedUserItems.rows[i];
        }
        res.json(getLoggedUserItems.rows);
    } catch (err) {
        console.error(err.message);
    }
};