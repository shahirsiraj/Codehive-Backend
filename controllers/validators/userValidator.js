const Joi = require('joi');


const validators = {

    // registerSchema: {}

    loginSchema: Joi.object(
        {
            name:Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required()
        }
    )
    
}

module.exports = validators;