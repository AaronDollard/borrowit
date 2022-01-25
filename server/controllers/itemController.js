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
        const { currentUserID } = req.body;
        console.log("getitemdebug", currentUserID)
        const getItems = await db.query("SELECT i.*, users.username FROM items i JOIN users ON users.userid = i.itemowner WHERE i.itemowner != $1",
            [currentUserID]);
        for (var i = 0; i < getItems.rows.length; i++) {
            var row = getItems.rows[i];
        }
        res.json(getItems.rows);
    } catch (err) {
        console.error(err.message);
    }
};

//get specific item clicked
module.exports.getSpecificItem = async (req, res) => {
    try {
        console.log("getSpecificItem - itemController Debug");
        const { itemID } = req.body;
        console.log("this is item id in backend", itemID)
        const getSpecificItem = await db.query("SELECT i.*, users.username FROM items i LEFT JOIN users ON users.userid = i.itemowner WHERE i.id = $1",
            [itemID]);
        res.json(getSpecificItem.rows);
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
            ("SELECT i.*, users.username FROM items i LEFT JOIN users ON users.userid = i.itemowner WHERE i.itemowner = $1",
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

//get specific user clicked
module.exports.getSpecificUser = async (req, res) => {
    try {
        console.log("getSpecificUser - itemController Debug");
        const { userID } = req.body;
        console.log(userID)
        const getSpecificUser = await db.query("SELECT * FROM users WHERE username = $1",
            [userID]);
        res.json(getSpecificUser.rows);
    } catch (err) {
        console.error(err.message);
    }
};

//get specific user items that a user clicked
module.exports.getClickedUserItems = async (req, res) => {
    try {
        console.log("getClickedUserItems - itemController Debug");
        const { userID } = req.body;

        const getClickedUserItems = await db.query
            ("SELECT * FROM items i LEFT JOIN users ON users.userid = i.itemowner WHERE users.username = $1",
                [userID])
            ;
        for (var i = 0; i < getClickedUserItems.rows.length; i++) {
            var row = getClickedUserItems.rows[i];
        }
        res.json(getClickedUserItems.rows);
    } catch (err) {
        console.error(err.message);
    }
};

//make an offer
module.exports.makeOffer = async (req, res) => {
    try {
        console.log("makeOffer - itemController Debug");
        const { id, lenderid, offerstatus, borrowerid } = req.body;

        const makeOffer = await db.query
            ("INSERT INTO offers ( itemid, lenderid, offerstatus, borrowerid ) VALUES($1, $2, $3, $4) RETURNING *",
                [id, lenderid, offerstatus, borrowerid]
            );
        res.json(makeOffer.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
};

//make an offer
module.exports.getIncomingOffers = async (req, res) => {
    try {
        console.log("getIncomingOffers - itemController Debug");
        const { currentUserID } = req.body;

        const getIncomingOffers = await db.query
            (`SELECT * FROM items 
            JOIN offers ON items.id = offers.itemid 
            JOIN users ON offers.borrowerid = users.userid 
            WHERE items.itemowner = $1`,
                [currentUserID])
            ;
        for (var i = 0; i < getIncomingOffers.rows.length; i++) {
            var row = getIncomingOffers.rows[i];
        }
        res.json(getIncomingOffers.rows);
    } catch (err) {
        console.error(err.message);
    }
};

//make an offer
module.exports.getOutgoingOffers = async (req, res) => {
    try {
        console.log("getOutgoingOffers - itemController Debug");
        const { currentUserID } = req.body;

        const getOutgoingOffers = await db.query
            (`SELECT * FROM items 
            JOIN offers ON items.id = offers.itemid 
            JOIN users ON offers.lenderid = users.userid 
            WHERE offers.borrowerid = $1`,
                [currentUserID])
            ;
        for (var i = 0; i < getOutgoingOffers.rows.length; i++) {
            var row = getOutgoingOffers.rows[i];
        }
        res.json(getOutgoingOffers.rows);
    } catch (err) {
        console.error(err.message);
    }
};