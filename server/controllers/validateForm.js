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

const validateForm = (req, res) => {
    const formData = req.body;
    formSchema
        .validate(formData)
        .catch(err => {
            res.status(422).send() //Data could not be processed
            console.log(err.errors);
        })
        .then(valid => {
            if (valid) {
                console.log("Form is accepted!")
            }
        })
}

module.exports = validateForm;