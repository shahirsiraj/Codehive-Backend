const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/UsersModel");
const userValidators = require("./validators/userValidator");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const userControllers = {
  register: async (req, res) => {
    const data = req.body;
    console.log("BE Registration Data:", data);

    const validationResult = userValidators.registerSchema.validate(data);

    if (validationResult.error) {
      res.statusCode = 400;
      return res.json({
        msg: `registration failed ${validationResult.error.details[0].message}`,
      });
    }

    try {
      const user = await userModel.findOne({ email: data.email });
      if (user) {
        return res.status(400).json({
          msg: "email already exists, please try another email",
        });
      }
    } catch (err) {
      return res.status(500).json({
        msg: `duplicate check failed ${err}`,
      });
    }

    const hash = await bcrypt.hash(data.password, 10);

    try {
      await userModel.create({
        name: data.name,
        email: data.email,
        password: hash,
        location: data.location,
        occupation: data.occupation,
      });
      console.log("Successfully registered", data.name);
    } catch (err) {
      return res.status(500).json({
        msg: `failed to create user: ${err}`,
      });
    }

    res.json();
  },

  login: async (req, res) => {
    const data = req.body;
    console.log("login data:", data);

    const validationResult = userValidators.loginSchema.validate(data);

    if (validationResult.error) {
      return res.status(400).json({
        msg: validationResult.error.details[0].message,
      });
    }

    try {
      const user = await userModel.findOne({ email: data.email });
      console.log("User:", user);

      if (!user) {
        return res.status(401).json({
          msg: "Login failed, please check login details",
        });
      }

      console.log("Data Password:", data.password);
      console.log("User Password:", user.password);
      const validLogin = await bcrypt.compare(data.password, user.password);

      if (!validLogin) {
        return res.status(401).json({
          msg: "Login failed, please check login details",
        });
      }

      const token = jwt.sign(
        {
          email: user.email,
        },
        process.env.APP_KEY,
        {
          expiresIn: "10 days",
          audience: "front-end",
          issuer: "server",
          subject: user._id.toString(),
        }
      );

      res.json({
        msg: "Login successful",
        user: user,
        token: token,
      });
    } catch (error) {
      console.log("Error:", error);
      res.status(500).json({
        msg: "Internal server error",
      });
    }
  },

  getUserById: async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Log the user data
      console.log("User fetched:", user);

      // Return the user data
      res.status(200).json(user);
    } catch (error) {
      console.log("Error occurred while fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  },

  listUsers: async (req, res) => {
    try {
      const users = await userModel.find();
      // console.log("listUsers:", users);
      res.status(200).json(users);
    } catch (err) {
      console.log("Error occurred while retrieving users:", err);
      return res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
      });
    }
  },

  getFriends: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await userModel.findById(userId);

      const friends = await Promise.all(
        user.friends.map((id) => userModel.findById(id))
      );

      const formattedFriends = friends.map(
        ({ _id, name, occupation, location }) => {
          return { _id, name, occupation, location };
        }
      );

      res.status(200).json(formattedFriends);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },

  // getSpecificFriend: async (req, res) => {},
  addRemoveFriend: async (req, res) => {
    try {
      const { userId, friendId } = req.params;
      console.log(`UserId: ${userId}, FriendId: ${friendId}`);

      const user = await userModel.findById(userId);
      const friend = await userModel.findById(friendId);

      if (!user) {
        console.log(`No user found with id: ${userId}`);
        return res
          .status(404)
          .json({ message: `No user found with id: ${userId}` });
      }

      if (!friend) {
        console.log(`No friend found with id: ${friendId}`);
        return res
          .status(404)
          .json({ message: `No friend found with id: ${friendId}` });
      }

      const friendIdAsObjectId = new mongoose.Types.ObjectId(friendId);
      const userIdAsObjectId = new mongoose.Types.ObjectId(userId);

      if (user.friends.includes(friendId)) {
        console.log(`Friend already in user's friend list. Removing friend.`);
        user.friends = user.friends.filter((id) => id.toString() !== friendId);
        friend.friends = friend.friends.filter(
          (id) => id.toString() !== userId
        );
      } else {
        console.log(`Friend not in user's friend list. Adding friend.`);
        user.friends.push(friendIdAsObjectId);
        friend.friends.push(userIdAsObjectId);
      }

      await user.save();
      await friend.save();

      const friends = await Promise.all(
        user.friends.map((id) => userModel.findById(id))
      );
      const formattedFriends = friends.map(
        ({ _id, name, occupation, location }) => {
          return { _id, name, occupation, location };
        }
      );

      console.log(
        `Success! Updated friends list sent: ${JSON.stringify(
          formattedFriends
        )}`
      );
      res.status(200).json(formattedFriends);
    } catch (err) {
      console.log(`Error: ${err.message}`);
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = userControllers;
