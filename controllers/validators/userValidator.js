const Joi = require("joi");

const validators = {
  registerSchema: Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().min(3).required(),
    password: Joi.string().required(),
    occupation: Joi.string().required(),
    location: Joi.string().required(),
  }),

  loginSchema: Joi.object({
    // name:Joi.string(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

module.exports = validators;
