const inquiryModel = require("../models/InquiryModel")

// ===================== CREATE INQUIRY (BUYER) =====================
const createInquiry = async (req, res) => {
    console.log("req.body inquiry", req.body)
    try {
        const { propertyId, message, contactPhone, contactEmail } = req.body
        const buyerId = req.user._id

        const savedInquiry = await inquiryModel.create({
            propertyId,
            buyerId,
            message,
            contactPhone,
            contactEmail,
        })

        res.status(201).json({
            message: "Inquiry sent successfully!!",
            data: savedInquiry,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while sending inquiry..",
            err: err.message,
        })
    }
}

// ===================== GET INQUIRIES FOR A PROPERTY (OWNER/AGENT/ADMIN) =====================
const getInquiriesByProperty = async (req, res) => {
    try {
        const { propertyId } = req.params

        const inquiries = await inquiryModel
            .find({ propertyId })
            .populate("buyerId", "firstName lastName email phone profilePic")
            .sort({ createdAt: -1 })

        res.json({
            message: "Inquiries fetched successfully!!",
            count: inquiries.length,
            data: inquiries,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while fetching inquiries..",
            err: err.message,
        })
    }
}

// ===================== GET MY INQUIRIES (BUYER) =====================
const getMyInquiries = async (req, res) => {
    try {
        const buyerId = req.user._id

        const inquiries = await inquiryModel
            .find({ buyerId })
            .populate("propertyId", "title price listingType images status")
            .sort({ createdAt: -1 })

        res.json({
            message: "My inquiries fetched successfully!!",
            count: inquiries.length,
            data: inquiries,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while fetching my inquiries..",
            err: err.message,
        })
    }
}

// ===================== UPDATE INQUIRY STATUS (OWNER/AGENT) =====================
const updateInquiryStatus = async (req, res) => {
    try {
        const id = req.params.id
        const { status } = req.body

        const validStatuses = ["Pending", "Contacted", "Closed"]
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status.." })
        }

        const updated = await inquiryModel.findByIdAndUpdate(id, { status }, { new: true })
        if (!updated) {
            return res.status(404).json({ message: "Inquiry not found.." })
        }

        res.json({
            message: "Inquiry status updated successfully!!",
            data: updated,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while updating inquiry..",
            err: err.message,
        })
    }
}

// ===================== DELETE INQUIRY =====================
const deleteInquiry = async (req, res) => {
    try {
        const id = req.params.id
        const deleted = await inquiryModel.findByIdAndDelete(id)
        if (!deleted) {
            return res.status(404).json({ message: "Inquiry not found.." })
        }
        res.json({ message: "Inquiry deleted successfully!!", data: deleted })
    } catch (err) {
        res.status(500).json({
            message: "Error while deleting inquiry..",
            err: err.message,
        })
    }
}

// ===================== GET ALL INQUIRIES (ADMIN) =====================
const getAllInquiries = async (req, res) => {
    try {
        const inquiries = await inquiryModel
            .find()
            .populate("propertyId", "title price")
            .populate("buyerId", "firstName lastName email")
            .sort({ createdAt: -1 })

        res.json({
            message: "All inquiries fetched successfully!!",
            count: inquiries.length,
            data: inquiries,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while fetching all inquiries..",
            err: err.message,
        })
    }
}

module.exports = {
    createInquiry,
    getInquiriesByProperty,
    getMyInquiries,
    updateInquiryStatus,
    deleteInquiry,
    getAllInquiries,
}
