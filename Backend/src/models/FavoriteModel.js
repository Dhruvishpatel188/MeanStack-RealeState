const mongoose = require("mongoose")
const Schema = mongoose.Schema

const favoriteSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        propertyId: {
            type: Schema.Types.ObjectId,
            ref: "properties",
            required: true,
        },
    },
    {
        timestamps: true, // createdAt will serve as savedAt
    }
)

// compound unique index --> user can't save same property twice
favoriteSchema.index({ userId: 1, propertyId: 1 }, { unique: true })

module.exports = mongoose.model("favorites", favoriteSchema)
