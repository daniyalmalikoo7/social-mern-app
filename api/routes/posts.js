const router = require("express").Router();
const mongoose = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");

//Create a post
router.post("/", async (req, res) => {
  console.log("hey there");
  const newPost = new Post({
    userId: req.body.userId,
    desc: req.body.desc,
    img: req.body.img,
    likes: req.body.likes,
  });
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error.message);
    console.log(error.message);
  }
});

//Update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log(post);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("The post has been updated");
    } else {
      res.status(403).json("You are not allowed to update anyone else's post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//Delete a post
router.delete("/:id", async (req, res) => {
  console.log(mongoose.Types.ObjectId.isValid(req.params.id));
  try {
    const post = await Post.findById(req.params.id);
    console.log(post);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("The post has been deleted");
    } else {
      res.status(403).json("You are not allowed to delete anyone else's post");
    }
  } catch (error) {
    res.status(500).json("The post you're trying to delete is already deleted");
  }
});

// like/dislike a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("Post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("Disliked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get one post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(403).json("The post you are looking for is not available");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//get timeline posts

router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    console.log(currentUser);
    const userPosts = await Post.find({ userId: currentUser._id });
    //use promise to iterate through data in case, if you directly use await inside it wont fetch all data
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId }); //returns each post in friendPosts array
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
