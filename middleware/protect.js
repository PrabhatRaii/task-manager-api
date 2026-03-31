const jwt = require("jsonwebtoken")

const protect = (req, res, next) => {
    try {
        const token = req.headers.authorization

        if (!token) {
            return res.status(401).json({ message: "No token. Access denied." })
        }

       const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId
        next()

    } catch (error) {
        res.status(401).json({ message: "Invalid token. Access denied." })
    }
}

module.exports = protect