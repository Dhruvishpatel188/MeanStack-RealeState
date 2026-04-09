const router = require("express").Router()
const visitController = require("../controllers/PropertyVisitController")
const validateToken = require("../middleware/AuthMiddleware")
const roleMiddleware = require("../middleware/RoleMiddleware")

// POST /api/visit/schedule --> BUYER
router.post("/schedule", validateToken, roleMiddleware(["BUYER", "ADMIN"]), visitController.scheduleVisit)

// GET /api/visit/my --> BUYER
router.get("/my", validateToken, roleMiddleware(["BUYER"]), visitController.getMyVisits)

// GET /api/visit/all --> ADMIN
router.get("/all", validateToken, roleMiddleware(["ADMIN"]), visitController.getAllVisits)

// GET /api/visit/property/:propertyId --> OWNER, AGENT, ADMIN
router.get("/property/:propertyId", validateToken, roleMiddleware(["OWNER", "AGENT", "ADMIN"]), visitController.getVisitsByProperty)

// PATCH /api/visit/:id --> OWNER, ADMIN
router.patch("/:id", validateToken, roleMiddleware(["OWNER", "AGENT", "ADMIN"]), visitController.updateVisitStatus)

module.exports = router
