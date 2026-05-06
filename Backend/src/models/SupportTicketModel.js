const mongoose = require("mongoose")
const Schema = mongoose.Schema

const supportTicketSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        subject: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["Open", "InProgress", "Closed"],
            default: "Open",
        },
        response: {
            type: String, // support team reply
            default: "",
        },
    },
    {
        timestamps: true, // createdAt, updatedAt
    }
)

module.exports = mongoose.model("support_tickets", supportTicketSchema)
