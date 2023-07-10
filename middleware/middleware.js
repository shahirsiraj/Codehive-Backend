const jwt = require('jsonwebtoken')

const middleware = (req, res, next) => {

    const authHeader = req.headers.authorization
    if (!authHeader) {
        
        return res.status(401).json({
                msg: `authorization not found!`
        })
    }
        
   

    const token = authHeader.substring(7)

    
    try {
        jwt.verify(token, process.env.APP_KEY)
    } catch(err) {

        return res.status(401).json({
            msg: `could not verify token: ${err}`
        })
    }

    next()
}

module.exports = middleware