
const CommentsModel = require('../models/CommentsModel')
const commentValidators = require("./validators/commentValidator")

const controllers = {

    listComments: async (req, res) => {
        const items = await CommentsModel.find()
        res.json(items)
    },

    getComments: async (req, res) => {
        const commentID = req.params.postID
        let comment = null

        try {
           
            comment = await CommentsModel.findById(commentID)
        } catch(err) {
            
            return res.status(500).json({
                msg: `error occured: ${err}`
            })
        }

  
        if (!comment) {
    
            
            return res.status(404).json({
                msg: `post does not exist!`
            })
        }

 
        return res.json(comment)
    },

    createComment: async (req, res) => {
      
        const data = req.body

        const validationResult = commentValidators.validate(data)
        if (validationResult.error) {

            return res.status(400).json({
                msg: validationResult.error.details[0].message
            })
        }


        const result = await CommentsModel.create({
            commenter: data.commenter,
            post: data.post,
            comment: data.comment,
            edited: data.editCheck
        })

        
        res.status(201).json({
            msg: `Post created: ${result}`
        })
    },

    updateComment: async (req, res) => {
        const data = req.body

        const commentID = req.params.postID


        
        let comment = null 

        try {
            comment = await CommentsModel.findById(commentID)
        } catch(err) {
    
            return res.status(500).json({
                msg: `error occured : ${err}`
            })
        }

        if (!comment) {
            return res.status(404).json({
                msg: `could not find specified comment`
            })
        }

        


        try {
            await CommentsModel.updateOne(
                {
                    _id: commentID
                },
                {
                    commenter: data.commenter,
                    post: data.post,
                    comment: data.comment,
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

    deleteComment: async (req, res) => {

        const commentID = req.params.postID


        
        let comment = null 

        try {
            comment = await CommentsModel.findById(commentID)
        } catch(err) {
    
            return res.status(500).json({
                msg: `error occured : ${err}`
            })
        }

        if (!comment) {
            return res.status(404).json({
                msg: `could not find specified comment`
            })
        }

        try {
            const result = await CommentsModel.deleteOne({_id : commentID})
        } catch (err) {
            return res.status(500).json({
                msg: `error occured: ${err}`
            })
        }

        res.json(result)


    }

}

module.exports = controllers
