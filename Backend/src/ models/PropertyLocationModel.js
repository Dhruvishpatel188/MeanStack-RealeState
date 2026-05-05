const mongoose = require("mongoose")
const Schema = mongoose.Schema

const propertyLocationSchema = new Schema({
    propertyId: {
        type: Schema.Types.ObjectId,
        ref: "properties",
        required: true,
        unique: true, // one location per property
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        default: "India",
    },
    pincode: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number, // for map integration
    },
    longitude: {
        type: Number, // for map integration
    },
})

module.exports = mongoose.model("property_locations", propertyLocationSchema)
