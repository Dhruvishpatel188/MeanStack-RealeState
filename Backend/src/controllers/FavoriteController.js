const favoriteModel = require("../models/FavoriteModel")

// ===================== ADD TO FAVORITES =====================
const addFavorite = async (req, res) => {
    try {
        const userId = req.user._id
        const { propertyId } = req.body

        const saved = await favoriteModel.create({ userId, propertyId })
        res.status(201).json({
            message: "Property added to favorites!!",
            data: saved,
        })
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Property already in favorites.." })
        }
        res.status(500).json({
            message: "Error while adding to favorites..",
            err: err.message,
        })
    }
}

// ===================== GET MY FAVORITES =====================
const getMyFavorites = async (req, res) => {
    try {
        const userId = req.user._id

        const favorites = await favoriteModel
            .find({ userId })
            .populate({
                path: "propertyId",
                select: "title price listingType propertyType images status bedrooms bathrooms area",
            })
            .sort({ createdAt: -1 })

        res.json({
            message: "Favorites fetched successfully!!",
            count: favorites.length,
            data: favorites,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while fetching favorites..",
            err: err.message,
        })
    }
}

// ===================== REMOVE FROM FAVORITES =====================
const removeFavorite = async (req, res) => {
    try {
        const userId = req.user._id
        const { propertyId } = req.params

        const deleted = await favoriteModel.findOneAndDelete({ userId, propertyId })
        if (!deleted) {
            return res.status(404).json({ message: "Favorite not found.." })
        }

        res.json({ message: "Property removed from favorites!!", data: deleted })
    } catch (err) {
        res.status(500).json({
            message: "Error while removing favorite..",
            err: err.message,
        })
    }
}

module.exports = { addFavorite, getMyFavorites, removeFavorite }
