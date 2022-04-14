const Joi = require("joi");

const createServiceScheduler = Joi.object()
  .options({ abortEarly: false })
  .keys({
    serviceType: Joi.string().required(),
    pickupDetails: Joi.object().keys({
      fullName: Joi.string().required(),
      location: Joi.string().required(),
      email: Joi.string().required(),
    }),
    dropoffPoint: Joi.object().keys({
      fullName: Joi.string().required(),
      location: Joi.string().required(),
      email: Joi.string().required(),
      phoneNumber: Joi.string().required(),
    }),
    itemType: Joi.array().items(Joi.string().trim().required()).required(),
    meansOfTransport: Joi.string().valid("bike", "van").required(),
  });

module.exports = { createServiceScheduler };
