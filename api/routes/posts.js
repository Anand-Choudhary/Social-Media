const router = require("express").Router();
const Post = require("../models/Posts");


router.post('/',async (req,res)=>{
    
    const newPost = new Post(req.body);

    try{
        const savedPost = await newPost.save();
        return res.status(200).json(savedPost);
    }
    catch(error) {
        return res.status(500).json(error);
    }
})

router.put('/:id',async (req,res)=>{
    try 
    {
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId)
        {
            await post.updateOne({$set:req.body})
            return res.status(200).json({
            
                message: "Post Updated"
            });
        }
        else{
            return res.status(403).json({
            
                message: "You can only update your post"
            });
        }
    } catch (error) {
        return res.status(500).json(error)
    }
})

router.get('/:id', async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
    if(post.userId===req.body.userId)
    {
        return res.status(500).json(post)
    }
    else{
        return res.status(403).json({
            
            message: "You can only access your post"
        });
    }
    } catch (error) {
        return res.status(500).json(error)
    }
})


router.delete('/deletepost/:id', async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId===req.body.userId)
        {
            await post.deleteOne();
            return res.status(200).json({
            
                message: "Post Deleted"
            });
        }
        else{
            return res.status(403).json({
            
                message: "You can only delete your post"
            });
        }
    } catch (error) {
        return res.status(500).json(error)
    }
})
//like and dislike
router.get('/:id', async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
})


module.exports = router;