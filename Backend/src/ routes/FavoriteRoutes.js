const router = require("express").Router()
const favoriteController = require("../controllers/FavoriteController")
const validateToken = require("../middleware/AuthMiddleware")

// POST /api/favorite/add
router.post("/add", validateToken, favoriteController.addFavorite)

// GET /api/favorite/my
router.get("/my", validateToken, favoriteController.getMyFavorites)

// DELETE /api/favorite/:propertyId
router.delete("/:propertyId", validateToken, favoriteController.removeFavorite)

module.exports = router
