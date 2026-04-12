const router = require("express").Router()
const inquiryController = require("../controllers/InquiryController")
const validateToken = require("../middleware/AuthMiddleware")
const roleMiddleware = require("../middleware/RoleMiddleware")

// POST /api/inquiry/add --> BUYER
router.post("/add", validateToken, roleMiddleware(["BUYER", "ADMIN"]), inquiryController.createInquiry)

// GET /api/inquiry/my --> BUYER - my inquiries
router.get("/my", validateToken, roleMiddleware(["BUYER"]), inquiryController.getMyInquiries)

// GET /api/inquiry/all --> ADMIN
router.get("/all", validateToken, roleMiddleware(["ADMIN"]), inquiryController.getAllInquiries)

// GET /api/inquiry/property/:propertyId --> OWNER, AGENT, ADMIN
router.get("/property/:propertyId", validateToken, roleMiddleware(["OWNER", "AGENT", "ADMIN"]), inquiryController.getInquiriesByProperty)

// PATCH /api/inquiry/:id --> OWNER, AGENT
router.patch("/:id", validateToken, roleMiddleware(["OWNER", "AGENT", "ADMIN"]), inquiryController.updateInquiryStatus)

// DELETE /api/inquiry/:id --> ADMIN
router.delete("/:id", validateToken, roleMiddleware(["ADMIN"]), inquiryController.deleteInquiry)

module.exports = router
