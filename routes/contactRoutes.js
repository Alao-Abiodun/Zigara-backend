const express = require('express')
const router = express.Router()
const contactController = require('../controllers/ContactUs/contactController')


router.post('/contact', contactController.contactUsHandler)

module.exports = router 