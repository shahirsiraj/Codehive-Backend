const Joi = require('joi');


const validators = {

    // registerSchema: {},

    loginSchema: Joi.object(
        {
            email: Joi.string().required(),
            password: Joi.string().required()
        }
    )
    
}

module.exports = validators;