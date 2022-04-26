const express = require('express')
const router = express.Router()
const { validateAuth } = require('../middleware/validator')
const notificationController = require('../controllers/notificationController')


router.get('/getnotifications', validateAuth, notificationController.getAllMessages)

module.exports = router  