const { Schema, model } = require("mongoose");

const serviceSchema = new Schema({
  serviceType: {
    type: String,
  },
  pickupDetails: {
    fullName: {
      type: String,
    },
    location: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  dropoffPoint: {
    fullName: {
      type: String,
    },
    location: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
  },
  itemType: {
    type: [],
  },
  meansOfTransport: {
    type: String,
    enum: ["bike", "van"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const serviceModel = model("Service", serviceSchema);

module.exports = serviceModel;
