const express = require("express");
const { authorize } = require("../middleware/index");
const Role = require("../middleware/role");

const router = express.Router();

const serviceScheduleCtrl = require("../controllers/service.controller");
const { validateAuth } = require("../middleware/validator");

router.post("/schedule", validateAuth, serviceScheduleCtrl.scheduleService);

router.get(
  "/orders",
  authorize(Role.Admin),
  serviceScheduleCtrl.getAllServices
);

module.exports = router;
