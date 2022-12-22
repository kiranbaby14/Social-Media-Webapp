const router = require("express").Router();
const User = require("../models/User");
// library to encrypt password
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {

    try{
        //generate hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })

        //save new user to DB
        const user = await newUser.save();
        res.status(200).json(user);
    }
    catch(err){
        res.status(500).json(err.message)
    }
    
})

router.post("/login", async (req, res) => {

    try{
        const user = await User.findOne({email: req.body.email})
        !user && res.status(404).json("no user found")
        
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json("wrong password")

        res.status(200).json(user);
    }
    catch(err){
        res.status(500).json(err.message)
    }
    
})
module.exports = router;