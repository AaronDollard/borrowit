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
            dbimage = "https://bit.ly/3o2VIK5"
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

//Update items
module.exports.updateItem = async (req, res) => {
    try {
        const { name, description, condition, period, photo, giveaway, itemID } = req.body;
        const imageAlt = "A photo has not yet been added for this item";
        var dbimage = "";
        var itemaway = ";"

        if (photo == "Link to photo") {
            dbimage = "https://bit.ly/3o2VIK5"
        } else dbimage = photo

        if (giveaway == true) {
            itemaway = "Keep"
        } else itemaway = "Borrow"

        const updateItem = await db.query
            (`UPDATE items SET 
            itemname = $1, 
            descr = $2, 
            condition = $3, 
            lendlength = $4, 
            photo = $5, 
            giveaway = $6, 
            imageAlt = $7 
            WHERE id = $8`,
                [name, description, condition, period, dbimage, itemaway, imageAlt, itemID]
            );
        res.json(updateItem.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
};

//Delete item
module.exports.deleteOffer = async (req, res) => {
    try {
        const { id, lenderid } = req.body;
        console.log(id)
        const updateItem = await db.query
            (`DELETE FROM offers WHERE 
                itemid = $1`, [id]
            );
        updateItem = await db.query
            (`DELETE FROM items WHERE 
                id = $1`, [id]
            );
        res.json(updateItem.rows[0]);
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

//get the 4 latests items from the database
module.exports.getLatestItem = async (req, res) => {
    try {
        const { currentUserID } = req.body;
        console.log("getLatestsitemdebug", currentUserID)
        const getItems = await db.query("SELECT i.*, users.username FROM items i JOIN users ON users.userid = i.itemowner WHERE i.itemowner != $1 ORDER BY i.id DESC limit 4",
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

        const getSpecificUser = await db.query("SELECT id, email, socials, phone, profilepic, firstname, home, surname, userid, username FROM users WHERE username = $1",
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
            ("SELECT users.username, i.itemname, i.photo, i.condition, i.descr, i.lendlength, i,giveaway, i.itemowner, i.id AS itemID, users.id AS userID FROM items AS i JOIN users ON users.userid = i.itemowner WHERE users.username = $1",
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

//Create a review for a user
module.exports.reviewUser = async (req, res) => {
    try {
        console.log("reviewUser - itemController Debug");
        const { reviewItem, reviewOwner, currentUserID, reviewValue, reviewText } = req.body;

        const reviewUserQuery = await db.query
            ("INSERT INTO reviews ( reviewee, reviewer, itemborrowed, review, outcome) VALUES($1, $2, $3, $4, $5) RETURNING *",
                [reviewOwner, currentUserID, reviewItem, reviewText, reviewValue]
            );
        res.json(reviewUserQuery.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
};


//Gets reviews for a user
module.exports.getUserReview = async (req, res) => {
    try {
        console.log("GetReviewUser - itemController Debug");
        const { userID } = req.body;

        const reviewQuery = await db.query
            (`SELECT username, itemborrowed, review, outcome
            FROM reviews
            JOIN  users ON reviews.reviewer = users.userid
            WHERE reviews.reviewee = $1`,
                [userID]
            );
        res.json(reviewQuery.rows);
        console.log(reviewQuery)
    } catch (err) {
        console.error(err.message);
    }
};

//Update the profile of a user
module.exports.updateUserProfile = async (req, res) => {
    try {
        console.log("updateUser - itemController Debug");
        const { fname, sname, email, home, socials, phone, profilepic, currentUserID } = req.body;

        console.log(currentUserID)
        const updateProfile = await db.query
            (`UPDATE users SET 
            firstname = $1, 
            surname = $2, 
            email = $3, 
            home = $4, 
            socials = $5, 
            phone = $6, 
            profilepic = $7 
            WHERE userid = $8`,
                [fname, sname, email, home, socials, phone, profilepic, currentUserID]
            );
        res.json(updateProfile.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
};

//Get users for admins
module.exports.getUsers = async (req, res) => {
    try {
        console.log("GetUsers - itemController Debug");

        const getUserQuery = await db.query
            (`SELECT username, email, firstname, surname, home, userrole, userid 
            FROM users`
            );
        res.json(getUserQuery.rows);
        console.log(getUserQuery)
    } catch (err) {
        console.error(err.message);
    }
};


//Get users for admins to ban
module.exports.banUsers = async (req, res) => {
    try {
        console.log("BanUsers - itemController Debug");

    } catch (err) {
        console.error(err.message);
    }
};

module.exports.findOfferStatus = async (req, res) => {
    try {
        console.log("findOfferStatus - itemController Debug");
        const { id, lenderid, borrowerid } = req.body;

        const findOfferStatus = await db.query
            (`SELECT * FROM offers AS o 
            WHERE o.lenderid = $1 AND o.borrowerid = $2 and o.itemid = $3`,
                [lenderid, borrowerid, id]
            );
        res.json(findOfferStatus.rows[0]);
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
            (`SELECT users.username, i.itemname, i.descr, i.photo, i.lendlength, i,giveaway, i.itemowner, i.id, offers.id AS offerID FROM items AS i 
            JOIN offers ON i.id = offers.itemid 
            JOIN users ON offers.borrowerid = users.userid 
            WHERE i.itemowner = $1 AND offers.offerstatus = 'PENDING'`,
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
            (`SELECT users.username, i.itemname, i.descr, i.photo, i.lendlength, i,giveaway, i.itemowner, i.id, offers.offerstatus, offers.id AS offerID FROM items AS i 
            JOIN offers ON i.id = offers.itemid 
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

//Offer response from a user
module.exports.offerResponse = async (req, res) => {
    try {
        console.log("offerResponse - itemController Debug");
        const { responseToOffer, responseToOfferID } = req.body;
        console.log("Offer Response Log: ", responseToOffer, responseToOfferID)

        const offerResponse = await db.query
            (`UPDATE offers
            SET offerstatus = $1
            WHERE id = $2`,
                [responseToOffer, responseToOfferID]);

        res.json(offerResponse.rows);
    } catch (err) {
        console.error(err.message);
    }
};

module.exports.dismissOffer = async (req, res) => {
    try {
        console.log("dismissOffer - itemController Debug");
        const { responseToOffer, responseToOfferID } = req.body;
        console.log("dismissOffer Log: ", responseToOffer, responseToOfferID)

        const offerResponse = await db.query
            (`UPDATE offers
            SET offerstatus = $1
            WHERE id = $2`,
                [responseToOffer, responseToOfferID]);

        res.json(offerResponse.rows);
    } catch (err) {
        console.error(err.message);
    }
};