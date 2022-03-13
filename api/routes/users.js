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

router.delete('/deleteaccount/:id',async (req,res)=>{
    if(req.body.userId === req.params.id)
    {
        try {
            const user = await User.findByIdAndDelete(req.params.id)
            return res.status(200).json({
                message: "Account Deleted"
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    }
    else{
        return res.status(500).json("You can only delete your account")
    }
})

router.get('/:id',async (req,res)=>{
    
    try {
        const user = await User.findById(req.params.id)
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json(error);
    }
    
})

router.get('/follow/unfollow/:id', async (req,res)=>{
    if(req.body.userId !== req.params.id)
    {
        try {
            const user = await User.findById(req.body.userId)
            const currentUser = await User.findById(req.params.id)
            if(!user.following.include(req.params.id))
            {
                await user.updateOne({$push: {following:req.params.id}})
                await currentUser.updateOne({$push:{followers:req.body.userId}})
                return res.status(200).json("User has been followed");
            }
            else{
                await user.updateOne({$pull: {following:req.params.id}})
                await currentUser.updateOne({$pull:{followers:req.body.userId}})
                return res.status(200).json("User has been unfollowed");
            }
        } catch (error) {
            return res.status(500).json(error,"neend me code likha hai");
        }
    }
    else{
        return res.status(403).json("Apne app ko kaise follow krega bhai");
    }
})

module.exports = router;