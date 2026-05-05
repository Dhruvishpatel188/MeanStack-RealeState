// controller first --> token ??? yes --> next() --> No --> res..
const jwt = require("jsonwebtoken")
const secret = process.env.JWT_SECRET || "real_estate_secret_key"

const validateToken = (req, res, next) => {
    const token = req.headers.authorization
    console.log("token received:", token)

    try {
        if (token) {
            // Bearer token...
            if (token.startsWith("Bearer ")) {
                const tokenValue = token.split(" ")[1] // Bearer <tokenValue>
                const decodedData = jwt.verify(tokenValue, secret)
                console.log("decoded data:", decodedData)
                req.user = decodedData // attach user info to request
                next()
            } else {
                res.status(401).json({
                    message: "token is not a Bearer Token",
                })
            }
        } else {
            res.status(401).json({
                message: "token is missing..",
            })
        }
    } catch (err) {
        res.status(500).json({
            message: "invalid or expired token",
            err: err.message,
        })
    }
}

module.exports = validateToken
