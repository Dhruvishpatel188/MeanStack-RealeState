// model --> connected database --> collection bind....
// require mongoose..
const mongoose = require("mongoose")
const Schema = mongoose.Schema

// create an object of Schema class
const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            enum: ["ADMIN", "AGENT", "OWNER", "BUYER", "SUPPORT"],
            default: "BUYER",
        },
        profilePic: {
            type: String, // image URL (cloudinary)
            default: "",
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
        },
        address: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        pincode: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true, // Active by default
        },
    },
    {
        timestamps: true, // createdAt, updatedAt auto added
    }
)

// connect userSchema with users collection in connected database
// model("collectionName", schemaObject)
module.exports = mongoose.model("users", userSchema)
// if users collection is not available it will create itself
