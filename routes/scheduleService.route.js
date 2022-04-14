const express = require("express");

const router = express.Router();

const serviceScheduleCtrl = require("../controllers/service.controller");
const { validateAuth } = require("../middleware/validator");

router.post("/schedule", validateAuth, serviceScheduleCtrl.scheduleService);

router.post("/create", serviceScheduleCtrl.createService);

module.exports = router;
