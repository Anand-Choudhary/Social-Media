const router = require("express").Router();

const bcrypt = require("bcrypt");

const User = require("../models/User");
const validate = require("../models/User");



router.post('/', async (req, res) => {
    // First Validate The Request
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error);
    }

    // Check if this user already exisits
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('That user already exisits!');
    } else {
        //bcrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        // Insert the new user if they do not exist yet
        user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        await user.save();
        res.send(user);
    }
});

router.put('/:id',async (req,res)=>{
    if(req.body.userId === req.params.id){
        if(req.body.password)
        {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
                const user = await User.findByIdAndUpdate(req.params.id,{
                    $set:req.body,
                });
                return res.status(200).json({
            
                    message: "Password Updated"
                });
            } catch (error) {
                return res.status(500).json(error);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set:req.body,
            });
            return res.status(200).json({
            
                message: "Account Updated"
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    }
    else{
        return res.status(401).json({
            
            message: "You can only update your profile!"
        });
    }
})

router.delete('/:id',async (req,res)=>{
    if(req.body.userId === req.params.id)
    {
        try {
            const user = await User.findByIdAndDelete(req.params.id,{
                
            })
        } catch (error) {
            
        }
    }
})

module.exports = router;