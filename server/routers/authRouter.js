const express = require("express");
const router = express.Router();
const validateForm = require("../controllers/validateForm");
const { handleLogin, attemptLogin, attemptSignUp } = require("../controllers/authController");
const { addItem, getItem, getLoggedUserItems, getSpecificItem, getSpecificUser, getClickedUserItems, makeOffer, getIncomingOffers, getOutgoingOffers, offerResponse } = require("../controllers/itemController");
const db = require("../db");

router.route("/login").get(handleLogin).post(validateForm, attemptLogin) //Validation for login page
router.post("/register", validateForm, attemptSignUp); //Validation for signup page


router.post("/items", addItem); //Post a new listing for an item
router.route("/itemsbrowse").post(getItem); //Get a list of all items that are not of the logged in user 
router.route("/items/:id").post(getSpecificItem);

router.route("/users/:id").post(getSpecificUser); //Display the profile of a specific user.
router.route("/myitems").post(getLoggedUserItems); //Display a list of items that a logged in user has offered.

router.route("/myincomingitems").post(getIncomingOffers); //Recieve a list of incoming offers.
router.route("/myoutgoingitems").post(getOutgoingOffers); //Recieve a list of outgoing offers.
router.route("/usersitems/:id").post(getClickedUserItems); //Display the clicked profile items details


router.post("/offers", makeOffer); //Post a new listing for an item.
router.post("/offerresponse", offerResponse); //The response from a user to an offer

module.exports = router;