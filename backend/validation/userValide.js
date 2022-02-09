const joi = require('joi');

const userValid = (body) => {
    const userValidSchema = joi.object({
        username: joi.string().min(4).max(15).trim().required(),
        email: joi.string().min(10).trim().required(),
        password: joi.string().min(4).trim().required()
    })
    return userValidSchema.validate(body)
}

module.exports = userValid