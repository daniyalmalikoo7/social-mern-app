const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.body.userId, {
        $set: req.body,
      });
      console.log("user", user);
      res.status(200).json("Account has been updated");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can only update your account");
  }
});
//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.body.userId);
      console.log("deleteUser");
      res.status(200).json("Account has been deleted successfully");
    } catch (error) {
      res.status(500).json(error.message);
    }
  } else {
    res.status(403).json("You can only delete your account");
  }
});

//get a user

router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//get friends

router.get("/friends/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById({ _id: friendId });
      })
    );
    const friendList = [];

    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });

    res.status(200).json(friendList);
  } catch (error) {
    res.status(500).json(error);
  }
});

//follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    //finding users
    try {
      const userToFollow = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (!userToFollow.followers.includes(req.body.userId)) {
        await userToFollow.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("User has been followed");
      } else {
        res.status(403).json("You have already followed this user");
      }
    } catch (error) {}
  } else {
    res.status(403).json("You cannot follow yourself");
  }
});

//unfollow a user

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    //finding users
    try {
      const userToFollow = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      console.log("check here userToFollow", userToFollow);
      if (userToFollow.followers.includes(req.body.userId)) {
        console.log("check here");
        await userToFollow.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("User has been unfollowed");
      } else {
        res.status(403).json("User has already been unfollowed");
      }
    } catch (error) {}
  } else {
    res.status(403).json("You cannot unfollow yourself");
  }
});

module.exports = router;
