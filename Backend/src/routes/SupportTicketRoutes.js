const router = require("express").Router()
const supportController = require("../controllers/SupportTicketController")
const validateToken = require("../middleware/AuthMiddleware")
const roleMiddleware = require("../middleware/RoleMiddleware")

// POST /api/support/create --> any logged in user
router.post("/create", validateToken, supportController.createTicket)

// GET /api/support/my --> any logged in user
router.get("/my", validateToken, supportController.getMyTickets)

// GET /api/support/all --> ADMIN, SUPPORT
router.get("/all", validateToken, roleMiddleware(["ADMIN", "SUPPORT"]), supportController.getAllTickets)

// PATCH /api/support/:id --> ADMIN, SUPPORT respond/update
router.patch("/:id", validateToken, roleMiddleware(["ADMIN", "SUPPORT"]), supportController.respondToTicket)

// DELETE /api/support/:id --> ADMIN only
router.delete("/:id", validateToken, roleMiddleware(["ADMIN"]), supportController.deleteTicket)

module.exports = router
