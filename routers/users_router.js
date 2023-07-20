const express = require("express");
const router = express.Router();

const userController = require("../controllers/usersControllers");
const authMiddleware = require("../middleware/middleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/:userId", userController.getUserById); // viewing user by id
router.get("/:userId/friends", authMiddleware, userController.getFriends); // view friends through id
router.get("/:userId/:friendId", authMiddleware, userController.getSpecificFriend); // view a friend through name

router.patch("/:userId/:friendId", authMiddleware, userController.addRemoveFriend);

module.exports = router;
