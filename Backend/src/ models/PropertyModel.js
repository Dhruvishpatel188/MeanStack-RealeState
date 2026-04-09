const mongoose = require("mongoose")
const Schema = mongoose.Schema

const propertySchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        propertyType: {
            type: String,
            enum: ["House", "Apartment", "Land", "Commercial", "Villa", "Plot"],
            required: true,
        },
        listingType: {
            type: String,
            enum: ["Sale", "Rent"],
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        area: {
            type: Number, // square feet
        },
        bedrooms: {
            type: Number,
            default: 0,
        },
        bathrooms: {
            type: Number,
            default: 0,
        },
        furnishing: {
            type: String,
            enum: ["Furnished", "Semi-Furnished", "Unfurnished"],
            default: "Unfurnished",
        },
        parking: {
            type: Boolean,
            default: false,
        },
        amenities: [
            {
                type: String, // Gym, Pool, Garden, Lift, Security, etc.
            },
        ],
        images: [
            {
                type: String, // image URLs (cloudinary)
            },
        ],
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "users", // reference to User collection
            required: true,
        },
        agentId: {
            type: Schema.Types.ObjectId,
            ref: "users", // reference to User collection (agent)
        },
        status: {
            type: String,
            enum: ["Available", "Sold", "Rented"],
            default: "Available",
        },
        approvalStatus: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },
    },
    {
        timestamps: true, // createdAt, updatedAt auto added
    }
)

module.exports = mongoose.model("properties", propertySchema)
