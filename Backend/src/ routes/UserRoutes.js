const router = require("express").Router()
const userController = require("../controllers/UserController")
const validateToken = require("../middleware/AuthMiddleware")
const roleMiddleware = require("../middleware/RoleMiddleware")
const uploadMiddleware = require("../middleware/UploadMiddleware")

// GET /api/user/users --> ADMIN only
router.get("/users", validateToken, roleMiddleware(["ADMIN"]), userController.getAllUsers)

// GET /api/user/:id --> ADMIN / own profile
router.get("/:id", validateToken, userController.getUserById)

// PUT /api/user/:id --> update own profile
router.put("/:id", validateToken, uploadMiddleware.upload.single("profilePic"), userController.updateUser)

// PATCH /api/user/toggle/:id --> ADMIN block/unblock
router.patch("/toggle/:id", validateToken, roleMiddleware(["ADMIN"]), userController.toggleUserStatus)

// PATCH /api/user/role/:id --> ADMIN change role
router.patch("/role/:id", validateToken, roleMiddleware(["ADMIN"]), userController.changeUserRole)

// DELETE /api/user/:id --> ADMIN only
router.delete("/:id", validateToken, roleMiddleware(["ADMIN"]), userController.deleteUser)

module.exports = router
