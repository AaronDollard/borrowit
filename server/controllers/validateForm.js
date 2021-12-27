const Yup = require("yup");

//Validates sign in / sign up page
const formSchema = Yup.object({
    username: Yup.string()
        .required("Username required!")
        .min(6, "Username too short!")
        .max(20, "Username too long!"),
    password: Yup.string()
        .required("Password required!")
        .min(6, "Password too short!")
        .max(20, "Password too long!"),
});

const validateForm = (req, res, next) => {
    const formData = req.body;
    formSchema
        .validate(formData)
        .catch(() => {
            res.status(422).send() //Data could not be processed
            console.log(err.errors);
        })
        .then(valid => {
            if (valid) {
                console.log("Form is accepted!")
                next();
            } else {
                res.status(422).send()
            }
        })
}

module.exports = validateForm;