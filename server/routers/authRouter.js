const express = require("express");
const router = express.Router();
const validateForm = require("../controllers/validateForm");
const { handleLogin, attemptLogin, attemptSignUp } = require("../controllers/authController");
const { addItem } = require("../controllers/itemController");
const db = require("../db");

router.route("/login").get(handleLogin).post(validateForm, attemptLogin) //Validation for login page
router.post("/register", validateForm, attemptSignUp); //Validation for signup page

router.route("/items").get(handleLogin).post(addItem);

module.exports = router;