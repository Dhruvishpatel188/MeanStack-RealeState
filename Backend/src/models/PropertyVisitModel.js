const mongoose = require("mongoose")
const Schema = mongoose.Schema

const propertyVisitSchema = new Schema(
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
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        visitDate: {
            type: Date,
            required: true,
        },
        visitTime: {
            type: String, // e.g. "10:30 AM"
            required: true,
        },
        status: {
            type: String,
            enum: ["Requested", "Approved", "Completed", "Cancelled"],
            default: "Requested",
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("property_visits", propertyVisitSchema)
