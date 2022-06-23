const router = require("express").Router();
const User = require("../models/User");
const validate = require("../models/User");
const passport = require('passport');



router.post('/signUp', async (req, res) => {
    // First Validate The Request
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    
    // Check if this user already exisits
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('That user already exisits!');
    } else {
        // Insert the new user if they do not exist yet
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        await user.save();
        res.send(user);
    }
});

router.post('/signIn', async (req,res)=>{

    
    try {
        const user = await User.findOne({
            username:req.body.username
        })

        if(user)
        {
            if(user.password === req.body.password)
            {
                return res.status(200).json({
            
                    message: "Logged In Successfully"
                });
            }
            else{
                return res.status(400).send('P assword is incorrect!')
            }
        }
        else{
            return res.status(500).send('User not found!')
        }
    } catch (error) {
        return res.status(500).json(error);
    }
 
})

router.post('/create-session', async (req,res)=>{
    
})

module.exports = router;