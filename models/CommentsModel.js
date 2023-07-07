const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema(
    {
        commenter: { type: mongoose.Schema.ObjectId, ref: "User" }, // ref to User Schema
        post: { type: mongoose.Schema.ObjectId, ref: "Posts" }, // ref to Posts Schema
        comment: { type: String, required: true },
        edited: { type: Boolean, required: false }

    },
    {
        timestamps: true
    }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

