const Service = require("../models/service.model");
const catchAsync = require("../utils/libs/catchAsync");
const AppError = require("../utils/libs/appError");
const { errorResMsg, successResMsg } = require("../utils/libs/response");

exports.scheduleService = catchAsync(async (req, res, next) => {
  try {
    console.log(req.user);
    let serviceType = req.body.serviceType;
    if (!serviceType) {
      return next(new AppError("Please provide service type", 400));
    }
    const serviceTypeArray = ["pickup_and_delivery", "packing_and_moving"];
    if (!serviceTypeArray.includes(serviceType)) {
      return next(new AppError("Please provide valid service type", 400));
    }
    if (serviceType === "pickup_and_delivery") {
      const { pickupDetails, dropoffPoint, itemType, meansOfTransport } =
        req.body;
      if (meansOfTransport !== "bike" || meansOfTransport !== "van") {
        return next(
          new AppError("Please provide valid means of transport", 400)
        );
      }
      const newService = new Service({
        serviceType,
        pickupDetails,
        dropoffPoint,
        itemType,
        meansOfTransport,
        user: req.user.id,
      });
      await newService.save();
      const dataInfo = {
        message: "Service scheduled successfully",
        newService,
      };
      return successResMsg(res, 201, dataInfo);
    } else if (serviceType === "packing_and_moving") {
      const { pickupDetails, dropoffPoint, itemType, meansOfTransport } =
        req.body;
      if (meansOfTransport !== "bike" || meansOfTransport !== "van") {
        return next(
          new AppError("Please provide valid means of transport", 400)
        );
      }
      const newService = new Service({
        serviceType,
        pickupDetails,
        dropoffPoint,
        itemType,
        meansOfTransport,
        user: req.user.id,
      });
      await newService.save();
      const dataInfo = {
        message: "Service scheduled successfully",
        newService,
      };
      return successResMsg(res, 201, dataInfo);
    }
  } catch (error) {
    console.log(error.message);
    return errorResMsg(res, 500, error.message);
  }
});

exports.createService = catchAsync(async (req, res, next) => {
  console.log("working");
});
