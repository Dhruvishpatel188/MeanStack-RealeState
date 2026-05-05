const router = require("express").Router()
const authController = require("../controllers/AuthController")
const validateToken = require("../middleware/AuthMiddleware")
const uploadMiddleware = require("../middleware/UploadMiddleware")
const zodValidationMiddleware = require("../middleware/zodValidationMiddleware")
const { registerSchema, loginSchema, changePasswordSchema } = require("../validationschema/UserValidationSchema")

// POST /api/auth/register  --> multer parses body first, then zod validates
router.post(
    "/register",
    uploadMiddleware.upload.single("profilePic"),
    zodValidationMiddleware(registerSchema),
    authController.register
)

// POST /api/auth/login  --> validate then login
router.post("/login", zodValidationMiddleware(loginSchema), authController.login)

// GET /api/auth/me  --> protected route
router.get("/me", validateToken, authController.getMyProfile)

// PUT /api/auth/change-password --> protected + validate
router.put(
    "/change-password",
    validateToken,
    zodValidationMiddleware(changePasswordSchema),
    authController.changePassword
)

module.exports = router
