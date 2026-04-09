const mongoose = require("mongoose")
const Schema = mongoose.Schema

const reviewSchema = new Schema(
    {
        propertyId: {
            type: Schema.Types.ObjectId,
            ref: "properties",
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
        },
        comment: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true, // createdAt, updatedAt
    }
)

// one review per user per property
reviewSchema.index({ propertyId: 1, userId: 1 }, { unique: true })

module.exports = mongoose.model("reviews", reviewSchema)
