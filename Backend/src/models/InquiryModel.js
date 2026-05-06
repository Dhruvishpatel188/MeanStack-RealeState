const mongoose = require("mongoose")
const Schema = mongoose.Schema

const inquirySchema = new Schema(
    {
        propertyId: {
            type: Schema.Types.ObjectId,
            ref: "properties",
            required: true,
        },
        buyerId: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        contactPhone: {
            type: String,
        },
        contactEmail: {
            type: String,
        },
        status: {
            type: String,
            enum: ["Pending", "Contacted", "Closed"],
            default: "Pending",
        },
    },
    {
        timestamps: true, // createdAt, updatedAt
    }
)

module.exports = mongoose.model("inquiries", inquirySchema)
