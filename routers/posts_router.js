const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsControllers");
const authMiddleware = require("../middleware/middleware");

// CREATE //
router.post("/", authMiddleware, postsController.createPost);

// READ //
router.get("/", postsController.listPosts);
router.get("/:postID", postsController.getPosts);

// UPDATE //
router.patch("/:postID", authMiddleware, postsController.updatePost);

// DELETE //
router.delete(
  "/:postID",
  //  authMiddleware,
  postsController.deletePost
);

module.exports = router;
