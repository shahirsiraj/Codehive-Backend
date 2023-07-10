const express = require('express')
const router = express.Router()
const postsController = require('../controllers/postsControllers')
const authMiddleware = require('../middleware/middleware')

router.get('/', postsController.listPosts)
router.get('/:postID', postsController.getPosts)
router.post('/', authMiddleware, postsController.createPost)
router.patch('/:postID', authMiddleware, postsController.updatePost)
router.delete('/:postID', authMiddleware, postsController.deletePost)

module.exports = router
