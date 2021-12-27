const express = require("express");
const router = express.Router();
const validateForm = require("../controllers/validateForm");
const { handleLogin, attemptLogin, attemptSignUp } = require("../controllers/authController");


router.route("/login").get(handleLogin).post(validateForm, attemptLogin) //Validation for login page
router.post("/register", validateForm, attemptSignUp); //Validation for signup page


module.exports = router;