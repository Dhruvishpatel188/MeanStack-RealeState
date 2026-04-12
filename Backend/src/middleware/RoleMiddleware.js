// role middleware --> checks if logged in user has required role
// usage: roleMiddleware(["ADMIN","AGENT"])

const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        try {
            // req.user is set by AuthMiddleware validateToken
            const userRole = req.user?.role

            if (!userRole) {
                return res.status(401).json({
                    message: "user role not found, please login again..",
                })
            }

            if (allowedRoles.includes(userRole)) {
                next() // role is allowed --> proceed
            } else {
                res.status(403).json({
                    message: `Access denied. Required roles: ${allowedRoles.join(", ")}`,
                })
            }
        } catch (err) {
            res.status(500).json({
                message: "error in role check..",
                err: err.message,
            })
        }
    }
}

module.exports = roleMiddleware
