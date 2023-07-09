const mongoose = require('mongoose');
// const commentsModel = require('./CommentsModel');

const postSchema = new mongoose.Schema(
    {
        poster: { type: mongoose.Schema.ObjectId, ref: "User", required: true }, // indicates who this post is from
        title: { type: String, required: true }, // title of the post
        content: { type: String, required: true, maxLength: [100, "Must not exceed 100 characters"] },
        likeCount: { type: Number, default: 0 },
        edited: { type: Boolean, default: false } // to check if it was edited/updated

        /*
        possible extras like:
        - check if original user for the posted post is logged in before allowing them to do any updating of posts
        - reference comments to this postSchema
        
        */

    },
    {
        timestamps: true
    }
);

const Posts = mongoose.model('Posts', postSchema);

module.exports = Posts;