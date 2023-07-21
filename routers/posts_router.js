const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsControllers");
const authMiddleware = require("../middleware/middleware");

// CREATE //
router.post("/", authMiddleware, postsController.createPost);

// READ //
router.get("/", postsController.listPosts); // view all the posts no matter whose on the HomePage
router.get("/", postsController.getPosts); // gets all posts
router.get("/:userId", postsController.getUserPosts); // gets user's posts


// UPDATE //
router.patch("/:postID", authMiddleware, postsController.updatePost);
router.patch("/:postID/likeToggle", authMiddleware, postsController.likeToggle);

// DELETE //
router.delete(
  "/:postID",
  //  authMiddleware,
  postsController.deletePost
);

module.exports = router;
