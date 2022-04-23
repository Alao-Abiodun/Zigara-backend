const express = require('express')
const router = express.Router()
const riderController = require('../controllers/riderController')

router.post('/createrider', riderController.registerRider)

router.get('/getriders', riderController.getAllRidersDetails)

router.get('/getrider/:id', riderController.getRiderDetails)

router.put('/update-rider-status/:id'. riderController.updateRiderStatus)

router.put('/updaterider/:id', riderController.updateRider)

router.get('/ridersranking', riderController.highestRiders)

router.delete('/deleterider', riderController.deleteRider)

module.exports = router