const router = require("express").Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");

//register

router.post("/register", async (req, res) => {
    try {
        //secure password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword

        })
        //save the new user and return reponse
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        //console.log(error);
        res.status(500).json(error)


    }
})


//login

router.post("/login", async (req, res) => {
    try {
        //check if user is present
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).send("user not found");

        //check if password is valid or not
        //here we are comparing req.body.password and actula password in database
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).send("invalid password");

        //send user if evryhtingis ok

        res.status(200).json(user)

    } catch (error) {
        res.status(500).json(error)

    }
})


module.exports = router;