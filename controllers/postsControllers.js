
const PostsModel = require('../models/PostModel')

const controllers = {

    listPosts: async (req, res) => {
        const items = await PostsModel.find()
        res.json(items)
    },

    getPosts: async (req, res) => {
        const postID = req.params.postID
        let post = null

        try {
           
            post = await PostsModel.findById(postID)
        } catch(err) {
            
            return res.status(500).json({
                msg: `error occured: ${err}`
            })
        }

  
        if (!post) {
    
            
            return res.status(404).json({
                msg: `post does not exist!`
            })
        }

 
        return res.json(post)
    },

    createPost: async (req, res) => {
      
        const data = req.body

        const result = await PostsModel.create({
            poster: data.name,
            title: data.title,
            content: data.content,
            likeCount: data.likeCount,
            edited: data.editCheck
        })

        
        res.status(201).json({
            msg: `Post created: ${result}`
        })
    },

    updateItem: async (req, res) => {
        const data = req.body

        const postID = req.params.postID


        
        let post = null 

        try {
            post = await PostsModel.findById(postID)
        } catch(err) {
    
            return res.status(500).json({
                msg: `error occured : ${err}`
            })
        }

        if (!PostsModel) {
            return res.status(404).json({
                msg: `could not find specified post`
            })
        }

        


        try {
            await PostsModel.updateOne(
                {
                    _id: postID
                },
                {
                    poster: data.name,
                    title: data.title,
                    content: data.content,
                    likeCount: data.likeCount,
                    edited: data.editCheck
                }
            )
        } catch(err) {
            return res.status(500).json({
                msg: `error occured: ${err}`
            })
        }

        res.json({
            msg: `updated!`
        })
    },

    deletePost: async (req, res) => {

        const postID = req.params.postID


        
        let post = null 

        try {
            post = await PostsModel.findById(postID)
        } catch(err) {
    
            return res.status(500).json({
                msg: `error occured : ${err}`
            })
        }

        if (!PostsModel) {
            return res.status(404).json({
                msg: `could not find specified post`
            })
        }

        try {
            const result = await PostsModel.deleteOne({_id : postID})
        } catch (err) {
            return res.status(500).json({
                msg: `error occured: ${err}`
            })
        }

        res.json(result)


    }

}

module.exports = controllers
