
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("../models/UsersModel")
const userValidators = require("./validators/userValidator")

const userControllers = {

    register: async (req, res) => {
        
        const data = req.body


        const validationResult = userValidators.registerSchema.validate(data)
        if (validationResult.error) {
            res.statusCode = 400

            return res.json({
                msg: validationResult.error.details[0].message
            })
        }

        try {
            const user = await userModel.findOne({email: data.email})
            if (user) {
                return res.status(400).json({
                    msg: "email already exists, please try another email"
                })
            }
        } catch(err) {
            
            return res.status(500).json({
                msg: `duplicate check failed ${err}`
            })
        }

        const hash = await bcrypt.hash(data.password, 10)

        try {
            await userModel.create({
                name: data.name,
                email: data.email,
                password: hash,
            })
        } catch(err) {
            
            return res.status(500).json({
                msg: `failed to create user: ${err}`
            })
        }
    
        res.json()
    },

    login: async (req, res) => {
        
        const data = req.body

        const validationResult = userValidators.loginSchema.validate(data)
        
        if (validationResult.error) {
            
            return res.status(400).json({
                msg: validationResult.error.details[0].message
            })
        }

      
        let user = null

        try {
            user = await userModel.findOne({email: data.email})
        } catch(err) {
            
            return res.status(500).json({
                msg: `error while finding user: ${err}`
            })
        }

        if (!user) {
            
            return res.status(401).json({
                msg: "login failed, please check login details"
            })
        }

        const validLogin = await bcrypt.compare(data.password, user.password)

        if (!validLogin) {
            
            return res.status(401).json({
                msg: "login failed, please check login details"
            })
        }

       
        const token = jwt.sign(
            {
                name: user.name,
                email: user.email,
            },
            process.env.APP_KEY,
            {
                expiresIn: "10 days",
                audience: "front-end",
                issuer: "server",
                subject: user._id.toString(), 
            }
        )

        res.json({
            msg: 'login successful',
            token: token,
        })
    },

}

module.exports = userControllers