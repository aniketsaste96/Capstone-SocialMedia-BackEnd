const router = require('express').Router();
const Post = require('../models/Post')
const User = require('../models/User')
//CREATE A POST 
//update POST 
//DELETE POST 
//LIKE
//GET 
//GET TIMELINE POSTS

//CREATE A POST 
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);

    try {
        const savePost = await newPost.save();
        res.status(200).json(savePost);

    } catch (error) {
        res.status(500).json(error);

    }
})



//UPDATE POST 
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("post has been updated!!!")

        } else {
            res.status(500).json("You can update only your post!!!")
        }


    } catch (error) {
        res.status(500).json(error);
    }
})


//UPDATE POST 
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("post has been deleted!!!")

        } else {
            res.status(500).json("You can delete only your post!!!")
        }


    } catch (error) {
        res.status(500).json(error);
    }
})


//lIKE/dislike POST 
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } })
            res.status(200).json("post has been liked!!!")

        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } })
            res.status(200).json("post has been disliked!!!")


        }


    } catch (error) {
        res.status(500).json(error);
    }
})


//get as post=> get

router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);

    } catch (error) {
        res.status(404).json(error)
    }
})

//get timeline POSTS
//what i learn here is this is conflicting with above /:id so chane it to /timeline/all

router.get("/timeline/:userId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                //watch for return 
                return Post.find({ userId: friendId });
            })

        )
        res.status(200).json(userPosts.concat(...friendPosts));
    } catch (error) {
        res.status(500).json(error);
    }
})


//GET ALL POSTS OF USER
router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        const posts = await Post.find({ userId: user._id });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;
