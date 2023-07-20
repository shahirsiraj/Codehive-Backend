const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsControllers");
const authMiddleware = require("../middleware/middleware");

// CREATE //
router.post("/", authMiddleware, postsController.createPost);

// READ //
router.get("/", postsController.listPosts); // view all the posts no matter whose on the HomePage
router.get("/:postID", postsController.getPosts); // will show only the user's posts

// UPDATE //
router.patch("/:postID", authMiddleware, postsController.updatePost);

// DELETE //
router.delete(
  "/:postID",
  //  authMiddleware,
  postsController.deletePost
);

module.exports = router;
