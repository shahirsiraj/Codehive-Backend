const express = require('express')
const router = express.Router()
const commentsController = require('../controllers/commentsControllers')
const authMiddleware = require('../middleware/middleware')

router.get('/', commentsController.listComments)
router.get('/:commentID', commentsController.getComments)
router.post('/', authMiddleware, commentsController.createComment)
router.patch('/:commentID', authMiddleware, commentsController.updateComment)
router.delete('/:commentID', authMiddleware, commentsController.deleteComment)

module.exports = router