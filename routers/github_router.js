const express = require('express')
const router = express.Router()
const githubController = require('../controllers/githubController')
// const authMiddleware = require('../middleware/middleware')

router.get('/getAccessToken', githubController.getAccessToken)
router.get('/getUserData', githubController.getUserData)
router.get('/repositories/:username', githubController.getUserRepositories)
router.get('/profile/:username', githubController.getUserProfile)




module.exports = router