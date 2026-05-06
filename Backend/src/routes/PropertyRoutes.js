const router = require("express").Router()
const propertyController = require("../controllers/PropertyController")
const validateToken = require("../middleware/AuthMiddleware")
const roleMiddleware = require("../middleware/RoleMiddleware")
const uploadMiddleware = require("../middleware/UploadMiddleware")

// POST /api/property/add --> OWNER or AGENT
router.post(
    "/add",
    validateToken,
    roleMiddleware(["OWNER", "AGENT", "ADMIN"]),
    uploadMiddleware.upload.array("images", 10), // max 10 images
    propertyController.addProperty
)

// GET /api/property/all --> PUBLIC (with filters)
router.get("/all", propertyController.getAllProperties)

// GET /api/property/admin/all --> ADMIN only (all approval statuses)
router.get("/admin/all", validateToken, roleMiddleware(["ADMIN"]), propertyController.getAllPropertiesAdmin)

// GET /api/property/my --> OWNER or AGENT - their own properties
router.get("/my", validateToken, roleMiddleware(["OWNER", "AGENT", "ADMIN"]), propertyController.getMyProperties)

// GET /api/property/city/:city --> search by city (PUBLIC)
router.get("/city/:city", propertyController.searchByCity)

// GET /api/property/:id --> PUBLIC - single property details
router.get("/:id", propertyController.getPropertyById)

// PUT /api/property/:id --> OWNER or AGENT update property
router.put(
    "/:id",
    validateToken,
    roleMiddleware(["OWNER", "AGENT", "ADMIN"]),
    uploadMiddleware.upload.array("images", 10),
    propertyController.updateProperty
)

// PATCH /api/property/approval/:id --> ADMIN approve/reject
router.patch("/approval/:id", validateToken, roleMiddleware(["ADMIN"]), propertyController.updateApprovalStatus)

// DELETE /api/property/:id --> OWNER, AGENT, ADMIN
router.delete("/:id", validateToken, roleMiddleware(["OWNER", "AGENT", "ADMIN"]), propertyController.deleteProperty)

module.exports = router
