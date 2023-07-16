const Joi = require('joi');


const validators = Joi.object(
        {
            post_id: { type: String, required: true }, // reference to the post that user is commenting on
            user_id: { type: String, required: true }, // reference to the user that comments
            comment: { type: String, min: 3 }
        }
)

module.exports = validators;