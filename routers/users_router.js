const express = require("express");
const router = express.Router();

const userController = require("../controllers/usersControllers");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/:userId", userController.getUserById);

module.exports = router;
