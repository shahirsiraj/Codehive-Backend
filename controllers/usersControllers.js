const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/UsersModel");
const userValidators = require("./validators/userValidator");

const userControllers = {
  register: async (req, res) => {
    const data = req.body;

    const validationResult = userValidators.registerSchema.validate(data);
    if (validationResult.error) {
      res.statusCode = 400;

      return res.json({
        msg: validationResult.error.details[0].message,
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
      });
    } catch (err) {
      return res.status(500).json({
        msg: `failed to create user: ${err}`,
      });
    }

    res.json();
  },

  login: async (req, res) => {
    const data = req.body;

    const validationResult = userValidators.loginSchema.validate(data);

    if (validationResult.error) {
      return res.status(400).json({
        msg: validationResult.error.details[0].message,
      });
    }

    let user = null;

    try {
      //   user = await userModel.findOne({ email: data.email });
      user = data.email;
      console.log(user, data.password, user.password);
    } catch (err) {
      return res.status(500).json({
        msg: `error while finding user: ${err}`,
      });
    }

    if (!user) {
      return res.status(401).json({
        msg: "login failed, please check login detailssss",
      });
    }

    user = await userModel.findOne({ email: data.email });
    console.log("Data Password:", data.password);
    console.log("User Password:", user.password);
    const validLogin = await bcrypt.compare(data.password, user.password);

    if (!validLogin) {
      return res.status(401).json({
        msg: "login failed, please check login details",
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
      msg: "login successful",
      user: user, // added user to payload
      token: token,
    });
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
      res.json(user);
    } catch (error) {
      console.log("Error occurred while fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  },
};

module.exports = userControllers;
