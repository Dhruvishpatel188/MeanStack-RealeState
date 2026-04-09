const propertyVisitModel = require("../models/PropertyVisitModel")
const propertyModel = require("../models/PropertyModel")

// ===================== SCHEDULE A VISIT (BUYER) =====================
const scheduleVisit = async (req, res) => {
    console.log("req.body visit", req.body)
    try {
        const { propertyId, visitDate, visitTime } = req.body
        const buyerId = req.user._id

        // get ownerId from property
        const property = await propertyModel.findById(propertyId)
        if (!property) {
            return res.status(404).json({ message: "Property not found.." })
        }

        const savedVisit = await propertyVisitModel.create({
            propertyId,
            buyerId,
            ownerId: property.ownerId,
            visitDate,
            visitTime,
        })

        res.status(201).json({
            message: "Visit scheduled successfully!! Waiting for owner approval.",
            data: savedVisit,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while scheduling visit..",
            err: err.message,
        })
    }
}

// ===================== GET VISITS FOR A PROPERTY (OWNER/AGENT) =====================
const getVisitsByProperty = async (req, res) => {
    try {
        const { propertyId } = req.params

        const visits = await propertyVisitModel
            .find({ propertyId })
            .populate("buyerId", "firstName lastName email phone profilePic")
            .sort({ visitDate: 1 })

        res.json({
            message: "Visits fetched successfully!!",
            count: visits.length,
            data: visits,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while fetching visits..",
            err: err.message,
        })
    }
}

// ===================== GET MY VISITS (BUYER) =====================
const getMyVisits = async (req, res) => {
    try {
        const buyerId = req.user._id

        const visits = await propertyVisitModel
            .find({ buyerId })
            .populate("propertyId", "title price images listingType")
            .populate("ownerId", "firstName lastName phone")
            .sort({ visitDate: 1 })

        res.json({
            message: "My visits fetched successfully!!",
            count: visits.length,
            data: visits,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while fetching my visits..",
            err: err.message,
        })
    }
}

// ===================== UPDATE VISIT STATUS (OWNER/ADMIN) =====================
const updateVisitStatus = async (req, res) => {
    try {
        const id = req.params.id
        const { status } = req.body

        const validStatuses = ["Requested", "Approved", "Completed", "Cancelled"]
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status.." })
        }

        const updated = await propertyVisitModel.findByIdAndUpdate(id, { status }, { new: true })
        if (!updated) {
            return res.status(404).json({ message: "Visit not found.." })
        }

        res.json({
            message: "Visit status updated successfully!!",
            data: updated,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while updating visit..",
            err: err.message,
        })
    }
}

// ===================== GET ALL VISITS (ADMIN) =====================
const getAllVisits = async (req, res) => {
    try {
        const visits = await propertyVisitModel
            .find()
            .populate("propertyId", "title price")
            .populate("buyerId", "firstName lastName email")
            .populate("ownerId", "firstName lastName email")
            .sort({ createdAt: -1 })

        res.json({
            message: "All visits fetched successfully!!",
            count: visits.length,
            data: visits,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while fetching all visits..",
            err: err.message,
        })
    }
}

module.exports = {
    scheduleVisit,
    getVisitsByProperty,
    getMyVisits,
    updateVisitStatus,
    getAllVisits,
}
