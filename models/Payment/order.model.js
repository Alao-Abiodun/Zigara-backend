const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    client: {
      type: String,
    },
    owners_contact: {
      type: String,
    },
    package: {
      type: [],
    },
    reciever: {
      type: String,
    },
    drop_off: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "In Transit", "Delayed", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamp: true,
  }
);

const Order = mongoose.model("order", orderSchema);
module.exports = Order;
