const PostsModel = require("../models/PostModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const controllers = {
  // CREATE //
  createPost: async (req, res) => {
    try {
      const data = req.body;
      console.log("Received payload:", data);

      await PostsModel.create({
        userId: data.userId,
        name: data.name,
        description: data.description,
        picturePath: data.picturePath,
      });

      const posts = await PostsModel.find();
      console.log("Retrieved Posts:", posts);

      res.status(201).json({
        msg: "Post created:",
        posts,
      });
    } catch (error) {
      console.log("Error creating post:", error);
      res.status(400).json({
        msg: "Error creating post",
        error: error.message,
      });
    }
  },

  // READ //
  listPosts: async (req, res) => {
    const items = await PostsModel.find();
    res.json(items);
  },

  getPosts: async (req, res) => {
    const postID = req.params.postID;
    let post = null;

    try {
      post = await PostsModel.findById(postID);
    } catch (err) {
      return res.status(500).json({
        msg: `error occured: ${err}`,
      });
    }

    if (!post) {
      return res.status(404).json({
        msg: `post does not exist!`,
      });
    }

    return res.json(post);
  },

  getUserPosts: async (req, res) => {
    try {
      const { userId } = req.params;
      const post = await PostsModel.find({ userId });
      res.status(200).json(post);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },

  // UPDATE //
  updatePost: async (req, res) => {
    const data = req.body;

    const postID = req.params.postID;

    let post = null;

    try {
      post = await PostsModel.findById(postID);
    } catch (err) {
      return res.status(500).json({
        msg: `error occured : ${err}`,
      });
    }

    if (!PostsModel) {
      return res.status(404).json({
        msg: `could not find specified post`,
      });
    }

    try {
      await PostsModel.updateOne(
        {
          _id: postID,
        },
        {
          poster: data.name,
          title: data.title,
          content: data.content,
          likeCount: data.likeCount,
          edited: data.editCheck,
        }
      );
    } catch (err) {
      return res.status(500).json({
        msg: `error occured: ${err}`,
      });
    }

    res.json({
      msg: `updated!`,
    });
  },

  likeToggle: async (req, res) => {
    try {
      const postId = req.body.postId;
      const userId = req.body.userId;
      console.log("postID:", postId, "userID:", userId);

      // Find the post
      const post = await PostsModel.findById(postId);
      console.log("Get post:", post);

      let updatedPost;
      // Check if the user has already liked the post
      if (post.like.includes(userId)) {
        // If they have, unlike the post
        updatedPost = await PostsModel.findByIdAndUpdate(
          postId,
          { $pull: { like: userId }, $inc: { likeCount: -1 } },
          { new: true } // 'new: true' returns the updated document
        );
        console.log(updatedPost);
      } else {
        // If they haven't, like the post
        updatedPost = await PostsModel.findByIdAndUpdate(
          postId,
          { $push: { like: userId }, $inc: { likeCount: 1 } },
          { new: true } // 'new: true' returns the updated document
        );
      }

      res.json(updatedPost);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while toggling like/unlike state." });
    }
  },

  // DELETE //
  deletePost: async (req, res) => {
    const postID = req.params.postID;
    console.log("postID:", postID);

    let post = null;

    try {
      post = await PostsModel.findById(postID);
    } catch (err) {
      return res.status(500).json({
        msg: `error occured : ${err}`,
      });
    }

    if (!post) {
      return res.status(404).json({
        msg: `could not find specified post`,
      });
    }

    try {
      const result = await PostsModel.deleteOne({ _id: postID });

      if (result.deletedCount === 1) {
        // Post deleted successfully
        console.log("Post deleted successfully");
        res.json({ msg: "Post deleted successfully" });
      } else {
        // Post not found or deletion operation failed
        console.log("Could not find the specified post");
        res.status(404).json({ msg: "Could not find the specified post" });
      }
    } catch (err) {
      // Error occurred during the deletion operation
      console.error("Error occurred:", err);
      res.status(500).json({ msg: `Error occurred: ${err}` });
    }
  },
};

module.exports = controllers;
