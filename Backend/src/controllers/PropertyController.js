const propertyModel = require("../models/PropertyModel")
const propertyLocationModel = require("../models/PropertyLocationModel")
const cloudinaryUtils = require("../utils/cloudinaryUtils")

// ===================== ADD PROPERTY (OWNER/AGENT) =====================
const addProperty = async (req, res) => {
    console.log("req.files", req.files)
    console.log("req.body", req.body)

    try {
        const {
            title, description, propertyType, listingType,
            price, area, bedrooms, bathrooms, furnishing,
            parking, amenities,
            // location fields
            address, city, state, country, pincode, latitude, longitude,
        } = req.body

        // upload multiple property images to cloudinary
        let imageUrls = []
        if (req.files && req.files.length > 0) {
            const filePaths = req.files.map((f) => f.path)
            imageUrls = await cloudinaryUtils.uploadMultipleToCloud(filePaths)
        }

        // ownerId comes from logged-in user token
        const ownerId = req.user._id
        const agentId = req.user.role === "AGENT" ? req.user._id : req.body.agentId || null

        // create property
        const savedProperty = await propertyModel.create({
            title,
            description,
            propertyType,
            listingType,
            price,
            area,
            bedrooms,
            bathrooms,
            furnishing,
            parking: parking === "true" || parking === true,
            amenities: amenities ? (Array.isArray(amenities) ? amenities : amenities.split(",")) : [],
            images: imageUrls,
            ownerId,
            agentId,
        })

        // save property location separately
        await propertyLocationModel.create({
            propertyId: savedProperty._id,
            address,
            city,
            state,
            country: country || "India",
            pincode,
            latitude: latitude ? Number(latitude) : undefined,
            longitude: longitude ? Number(longitude) : undefined,
        })

        res.status(201).json({
            message: "Property listed successfully!! Pending admin approval.",
            data: savedProperty,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while adding property..",
            err: err.message,
        })
    }
}

// ===================== GET ALL PROPERTIES (PUBLIC - with filters) =====================
const getAllProperties = async (req, res) => {
    try {
        const filter = { approvalStatus: "Approved" }

        // filters from query params
        if (req.query.propertyType) filter.propertyType = req.query.propertyType
        if (req.query.listingType) filter.listingType = req.query.listingType
        if (req.query.furnishing) filter.furnishing = req.query.furnishing
        if (req.query.bedrooms) filter.bedrooms = Number(req.query.bedrooms)
        if (req.query.parking) filter.parking = req.query.parking === "true"
        if (req.query.status) filter.status = req.query.status

        // price range filter
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {}
            if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice)
            if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice)
        }

        // area range filter
        if (req.query.minArea || req.query.maxArea) {
            filter.area = {}
            if (req.query.minArea) filter.area.$gte = Number(req.query.minArea)
            if (req.query.maxArea) filter.area.$lte = Number(req.query.maxArea)
        }

        // search by title keyword
        if (req.query.search) {
            filter.title = { $regex: req.query.search, $options: "i" }
        }

        // pagination
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit

        // sort
        const sortBy = req.query.sortBy || "createdAt"
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1

        const [properties, total] = await Promise.all([
            propertyModel
                .find(filter)
                .populate("ownerId", "firstName lastName phone email")
                .populate("agentId", "firstName lastName phone email")
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit),
            propertyModel.countDocuments(filter),
        ])

        // get locations for these properties
        const propertyIds = properties.map((p) => p._id)
        const locations = await propertyLocationModel.find({ propertyId: { $in: propertyIds } })
        const locationMap = {}
        locations.forEach((l) => { locationMap[l.propertyId.toString()] = l })

        // attach location to each property
        const propertiesWithLocation = properties.map((p) => ({
            ...p.toObject(),
            location: locationMap[p._id.toString()] || null,
        }))

        res.json({
            message: "Properties fetched successfully!!",
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: propertiesWithLocation,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while fetching properties..",
            err: err.message,
        })
    }
}

// ===================== GET SINGLE PROPERTY =====================
const getPropertyById = async (req, res) => {
    try {
        const id = req.params.id

        const property = await propertyModel
            .findById(id)
            .populate("ownerId", "firstName lastName phone email profilePic")
            .populate("agentId", "firstName lastName phone email profilePic")

        if (!property) {
            return res.status(404).json({ message: "Property not found.." })
        }

        // get location
        const location = await propertyLocationModel.findOne({ propertyId: id })

        res.json({
            message: "Property fetched successfully!!",
            data: { ...property.toObject(), location },
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while fetching property..",
            err: err.message,
        })
    }
}

// ===================== GET MY PROPERTIES (OWNER/AGENT) =====================
const getMyProperties = async (req, res) => {
    try {
        const userId = req.user._id
        const role = req.user.role

        const filter = role === "AGENT" ? { agentId: userId } : { ownerId: userId }

        const properties = await propertyModel.find(filter).sort({ createdAt: -1 })

        res.json({
            message: "My properties fetched successfully!!",
            count: properties.length,
            data: properties,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while fetching my properties..",
            err: err.message,
        })
    }
}

// ===================== UPDATE PROPERTY =====================
const updateProperty = async (req, res) => {
    try {
        const id = req.params.id
        let updateData = { ...req.body }

        // upload new images if provided
        if (req.files && req.files.length > 0) {
            const filePaths = req.files.map((f) => f.path)
            const newImageUrls = await cloudinaryUtils.uploadMultipleToCloud(filePaths)
            updateData.images = newImageUrls
        }

        // don't allow approval status change from this route
        delete updateData.approvalStatus
        delete updateData.ownerId

        const updatedProperty = await propertyModel.findByIdAndUpdate(id, updateData, { new: true })
        if (!updatedProperty) {
            return res.status(404).json({ message: "Property not found.." })
        }

        // update location if location fields present
        const locationFields = ["address", "city", "state", "country", "pincode", "latitude", "longitude"]
        const locationUpdate = {}
        locationFields.forEach((field) => {
            if (req.body[field] !== undefined) locationUpdate[field] = req.body[field]
        })

        if (Object.keys(locationUpdate).length > 0) {
            await propertyLocationModel.findOneAndUpdate(
                { propertyId: id },
                locationUpdate,
                { new: true, upsert: true }
            )
        }

        res.json({
            message: "Property updated successfully!!",
            data: updatedProperty,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while updating property..",
            err: err.message,
        })
    }
}

// ===================== DELETE PROPERTY =====================
const deleteProperty = async (req, res) => {
    try {
        const id = req.params.id
        const deleted = await propertyModel.findByIdAndDelete(id)
        if (!deleted) {
            return res.status(404).json({ message: "Property not found.." })
        }
        // delete location too
        await propertyLocationModel.findOneAndDelete({ propertyId: id })

        res.json({
            message: "Property deleted successfully!!",
            data: deleted,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while deleting property..",
            err: err.message,
        })
    }
}

// ===================== APPROVE / REJECT PROPERTY (ADMIN) =====================
const updateApprovalStatus = async (req, res) => {
    try {
        const id = req.params.id
        const { approvalStatus } = req.body

        const validStatuses = ["Pending", "Approved", "Rejected"]
        if (!validStatuses.includes(approvalStatus)) {
            return res.status(400).json({ message: "Invalid approval status.." })
        }

        const updated = await propertyModel.findByIdAndUpdate(id, { approvalStatus }, { new: true })
        if (!updated) {
            return res.status(404).json({ message: "Property not found.." })
        }

        res.json({
            message: `Property ${approvalStatus} successfully!!`,
            data: updated,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while updating approval status..",
            err: err.message,
        })
    }
}

// ===================== SEARCH PROPERTIES BY CITY =====================
const searchByCity = async (req, res) => {
    try {
        const { city } = req.params

        // find location docs matching city
        const locations = await propertyLocationModel.find({
            city: { $regex: city, $options: "i" },
        })

        const propertyIds = locations.map((l) => l.propertyId)

        const properties = await propertyModel
            .find({ _id: { $in: propertyIds }, approvalStatus: "Approved" })
            .populate("ownerId", "firstName lastName phone email")

        // attach location
        const locationMap = {}
        locations.forEach((l) => { locationMap[l.propertyId.toString()] = l })

        const result = properties.map((p) => ({
            ...p.toObject(),
            location: locationMap[p._id.toString()] || null,
        }))

        res.json({
            message: `Properties in ${city} fetched successfully!!`,
            count: result.length,
            data: result,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while searching properties by city..",
            err: err.message,
        })
    }
}

// ===================== GET ALL PROPERTIES FOR ADMIN (all statuses) =====================
const getAllPropertiesAdmin = async (req, res) => {
    try {
        const filter = {}
        if (req.query.approvalStatus) filter.approvalStatus = req.query.approvalStatus

        const properties = await propertyModel
            .find(filter)
            .populate("ownerId", "firstName lastName email")
            .populate("agentId", "firstName lastName email")
            .sort({ createdAt: -1 })

        res.json({
            message: "All properties fetched (admin) successfully!!",
            count: properties.length,
            data: properties,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while fetching all properties (admin)..",
            err: err.message,
        })
    }
}

module.exports = {
    addProperty,
    getAllProperties,
    getPropertyById,
    getMyProperties,
    updateProperty,
    deleteProperty,
    updateApprovalStatus,
    searchByCity,
    getAllPropertiesAdmin,
}
