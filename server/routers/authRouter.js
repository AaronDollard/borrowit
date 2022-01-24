const express = require("express");
const router = express.Router();
const validateForm = require("../controllers/validateForm");
const { handleLogin, attemptLogin, attemptSignUp } = require("../controllers/authController");
const { addItem, getItem, getLoggedUserItems, getSpecificItem, getSpecificUser } = require("../controllers/itemController");
const db = require("../db");

router.route("/login").get(handleLogin).post(validateForm, attemptLogin) //Validation for login page
router.post("/register", validateForm, attemptSignUp); //Validation for signup page


router.post("/items", addItem); //Post a new listing for an item
router.route("/items").get(getItem); //Get a list of all items 
router.route("/items/:id").post(getSpecificItem, getSpecificUser);
router.route("/users/:id").post(getSpecificUser);
router.route("/myitems").post(getLoggedUserItems);
module.exports = router;