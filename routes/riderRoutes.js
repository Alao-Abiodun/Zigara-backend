const express = require('express')
const router = express.Router()
const riderController = require('../controllers/riderController')
const { validateAuth } = require('../middleware/validator')

router.post('/createrider', validateAuth, riderController.registerRider)

router.get('/getriders', validateAuth, riderController.getAllRidersDetails)

router.get('/getrider/:id',validateAuth, riderController.getRiderDetails)

router.post('/update-rider-status/:id', validateAuth, riderController.updateRiderStatus)

router.post('/updaterider/:id',validateAuth, riderController.updateRider)

router.get('/ridersranking', validateAuth, riderController.highestRiders)

router.post('/deleterider/:id',validateAuth, riderController.deleteRider)

module.exports = router