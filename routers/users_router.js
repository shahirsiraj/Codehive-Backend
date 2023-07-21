const express = require("express");
const router = express.Router();

const userController = require("../controllers/usersControllers");
const authMiddleware = require("../middleware/middleware");

// Route param order listing matters
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/listUsers", userController.listUsers); // suggested friends
router.get("/:userId", userController.getUserById); // viewing user by id
router.get("/:userId/friends", authMiddleware, userController.getFriends); // view friends through id
router.patch(
  "/:userId/:friendId",
  authMiddleware,
  userController.addRemoveFriend
);
// router.get(
//   "/:userId/:friendId",
//   authMiddleware,
//   userController.getSpecificFriend
// ); // view a friend through name

module.exports = router;
