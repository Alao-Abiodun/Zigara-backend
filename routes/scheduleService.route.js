const express = require("express");
const { authorize } = require("../middleware/index");
const Role = require("../middleware/role");

const router = express.Router();

const serviceScheduleCtrl = require("../controllers/service.controller");
const { validateAuth } = require("../middleware/validator");

router.post("/schedule", validateAuth, serviceScheduleCtrl.scheduleService);

router.get("/orders", serviceScheduleCtrl.getAllServices);

// router.get("/orders", serviceScheduleCtrl.getAllOrders);

module.exports = router;
 