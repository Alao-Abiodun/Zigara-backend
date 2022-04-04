const validateUser = require('../../utils/validations/index')

// Register Validation schema
const registrationSchema = Joi.object({
    firstName: Joi.string().required(), 
    lastName: Joi.string().required(), 
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    phone: Joi.number().required()
})

// login Validation schema
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8)
})

// Authentication
const registerUser = (req, res) => {
    validateUser(registrationSchema)
    // Continue with registration logic
    //Please Note: While creating a new user, use assign from the model userId: uuid.v4() 
}

const loginUser = (req, res) => {
    validateUser(loginSchema)
    // Continue with login logic
}


module.exports = {
    registerUser,
    loginUser
}