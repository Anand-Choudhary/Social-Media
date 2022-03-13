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

router.get('/like/dislike/:id',async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json("The post has been liked by",req.body.userId)
        }
        else{
            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(200).json("The post has been disliked by",req.body.userId)

        }
    }
    catch (error){
        return res.status(500).json(error);
    }
})

//all posts

router.get('/timeline/all',async(req,res)=>{
    
    try {
        const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({userId:currentUser._id});
    const friendPosts = await Promise.all(
        currentUser.followings.map(friendId=>{
            Post.find({userId:friendId});
        })
    );
    res.json(userPosts.concat(...friendPosts))
    } catch (error) {
        res.status(500).json(error);
    }
})


module.exports = router;