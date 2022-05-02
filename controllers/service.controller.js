const Service = require("../models/service.model");
const Order = require("../models/Payment/order.model");
const catchAsync = require("../utils/libs/catchAsync");
const role = require("../middleware/role")
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
      if (meansOfTransport !== "bike" && meansOfTransport !== "van") {
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

      // add Service details to order model
      const orderDetails = {
        client: req.user.firstname,
        owners_contact: req.user.phonenumber,
        package: itemType,
        reciever: pickupDetails.fullName,
        drop_off: dropoffPoint.location,
      };

      const order = new Order({
        orderDetails,
        status: "Pending",
      });

      await order.save();

      await newService.save();
      const dataInfo = {
        message: "Service scheduled successfully",
        newService,
      };
      return successResMsg(res, 201, dataInfo);
    } else if (serviceType === "packing_and_moving") {
      const { pickupDetails, dropoffPoint, itemType, meansOfTransport } =
        req.body;
      if (meansOfTransport !== "bike" && meansOfTransport !== "van") {
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

      // console.log("firstname:", req.user.firstname);

      // const orderDetails = {
      //   client: req.user.firstname,
      //   owners_contact: req.user.phonenumber,
      //   package: itemType,
      //   reciever: pickupDetails.fullName,
      //   drop_off: dropoffPoint.location,
      // };

      console.log(newService)
      console.log("Bla")

      const order = new Order({
        client: req.user.firstname,
        owners_contact: req.user.phonenumber,
        package: itemType,
        reciever: pickupDetails.fullName,
        drop_off: dropoffPoint.location,
        status: "Pending",
      });

      console.log(order)

      await order.save();

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

// get all orders from orders model
// exports.getAllOrders = catchAsync(async (req, res, next) => {
//   const orders = await Order.find();
//   const dataInfo = {
//     message: "All orders",
//     orders,
//   };
//   return successResMsg(res, 200, dataInfo); 
// });

// get all services order using aggregate method
exports.getAllServices = catchAsync(async (req, res, next) => {
  try {
    const services = await Service.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          dropoffPoint: 1,
          itemType: 1,
          fullName: 1,
          location: 1,
          user: {
            phonenumber: 1,
            firstname: 1,
          },
        },
      },
    ]);
    const dataInfo = {
      message: "All services",
      services,
    };
    return successResMsg(res, 200, dataInfo);
  } catch (error) {
    console.log(error.message);
    return errorResMsg(res, 500, error.message);
  }
});

// get all
