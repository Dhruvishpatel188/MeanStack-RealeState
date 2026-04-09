const reviewModel = require("../models/ReviewModel")

// ===================== ADD REVIEW =====================
const addReview = async (req, res) => {
    try {
        const userId = req.user._id
        const { propertyId, rating, comment } = req.body

        const saved = await reviewModel.create({ propertyId, userId, rating, comment })
        res.status(201).json({
            message: "Review added successfully!!",
            data: saved,
        })
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "You have already reviewed this property.." })
        }
        res.status(500).json({
            message: "Error while adding review..",
            err: err.message,
        })
    }
}

// ===================== GET REVIEWS BY PROPERTY =====================
const getReviewsByProperty = async (req, res) => {
    try {
        const { propertyId } = req.params

        const reviews = await reviewModel
            .find({ propertyId })
            .populate("userId", "firstName lastName profilePic")
            .sort({ createdAt: -1 })

        // calculate average rating
        const avgRating =
            reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0

        res.json({
            message: "Reviews fetched successfully!!",
            count: reviews.length,
            averageRating: avgRating.toFixed(1),
            data: reviews,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while fetching reviews..",
            err: err.message,
        })
    }
}

// ===================== DELETE REVIEW (ADMIN/OWNER) =====================
const deleteReview = async (req, res) => {
    try {
        const id = req.params.id
        const deleted = await reviewModel.findByIdAndDelete(id)
        if (!deleted) {
            return res.status(404).json({ message: "Review not found.." })
        }
        res.json({ message: "Review deleted successfully!!", data: deleted })
    } catch (err) {
        res.status(500).json({
            message: "Error while deleting review..",
            err: err.message,
        })
    }
}

// ===================== GET ALL REVIEWS (ADMIN) =====================
const getAllReviews = async (req, res) => {
    try {
        const reviews = await reviewModel
            .find()
            .populate("propertyId", "title")
            .populate("userId", "firstName lastName email")
            .sort({ createdAt: -1 })

        res.json({
            message: "All reviews fetched successfully!!",
            count: reviews.length,
            data: reviews,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while fetching all reviews..",
            err: err.message,
        })
    }
}

module.exports = { addReview, getReviewsByProperty, deleteReview, getAllReviews }
