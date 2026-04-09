const router = require("express").Router()
const reviewController = require("../controllers/ReviewController")
const validateToken = require("../middleware/AuthMiddleware")
const roleMiddleware = require("../middleware/RoleMiddleware")

// POST /api/review/add --> BUYER
router.post("/add", validateToken, roleMiddleware(["BUYER", "ADMIN"]), reviewController.addReview)

// GET /api/review/property/:propertyId --> PUBLIC
router.get("/property/:propertyId", reviewController.getReviewsByProperty)

// GET /api/review/all --> ADMIN
router.get("/all", validateToken, roleMiddleware(["ADMIN"]), reviewController.getAllReviews)

// DELETE /api/review/:id --> ADMIN
router.delete("/:id", validateToken, roleMiddleware(["ADMIN"]), reviewController.deleteReview)

module.exports = router
