const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//create a user post
router.post("/", async (req, res) => {
    const newPost = await new Post(req.body);

    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err.message)
    }
})

//Update a user post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await Post.updateOne({ $set: req.body });
            res.status(200).json("post updated")

        } else {
            res.status(403).json("You can only update your post")
        }
    } catch (err) {
        res.status(500).json(err.message)
    }

})

//Delete a user post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("post deleted")

        } else {
            res.status(403).json("You can only delete your post")
        }
    } catch (err) {
        res.status(500).json(err.message)
    }

})


//Like a user post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } })
            res.status(200).json("you liked this post")
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } })
            res.status(403).json("you removed like")
        }
    } catch (err) {
        res.status(500).json(err.message)
    }
})

//Get a post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json(err.message)
    }
})


//Post timeline (return all of your and your followings posts )
router.get("/timeline/:userId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId })
            })
        )
        console.log(friendPosts)
        res.status(200).json(userPosts.concat(...friendPosts))
    } catch (err) {
        res.status(500).json(err.message)
    }
})

router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findById(req.params.username);
        const posts = await Post.find({ userId: user._id })
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json(err.message);
    }
})

module.exports = router;