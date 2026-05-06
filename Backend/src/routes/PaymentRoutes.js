const router = require("express").Router()
const paymentController = require("../controllers/PaymentController")
const validateToken = require("../middleware/AuthMiddleware")
const roleMiddleware = require("../middleware/RoleMiddleware")

// POST /api/payment/create --> BUYER
router.post("/create", validateToken, roleMiddleware(["BUYER"]), paymentController.createPayment)

// GET /api/payment/my --> BUYER
router.get("/my", validateToken, roleMiddleware(["BUYER"]), paymentController.getMyPayments)

// GET /api/payment/all --> ADMIN
router.get("/all", validateToken, roleMiddleware(["ADMIN"]), paymentController.getAllPayments)

// PATCH /api/payment/:id --> ADMIN
router.patch("/:id", validateToken, roleMiddleware(["ADMIN"]), paymentController.updatePaymentStatus)

module.exports = router
