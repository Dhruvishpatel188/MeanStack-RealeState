const mongoose = require("mongoose")
const Schema = mongoose.Schema

const paymentSchema = new Schema(
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
        amount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ["UPI", "Card", "Net Banking", "Cash", "Cheque"],
            required: true,
        },
        transactionId: {
            type: String,
            unique: true,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Completed", "Failed"],
            default: "Pending",
        },
        paymentDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("payments", paymentSchema)
