const paymentModel = require("../models/PaymentModel")
const propertyModel = require("../models/PropertyModel")
const { v4: uuidv4 } = require("crypto") // use crypto for unique transactionId

// ===================== CREATE PAYMENT =====================
const createPayment = async (req, res) => {
    console.log("req.body payment", req.body)
    try {
        const buyerId = req.user._id
        const { propertyId, amount, paymentMethod } = req.body

        // get ownerId from property
        const property = await propertyModel.findById(propertyId)
        if (!property) {
            return res.status(404).json({ message: "Property not found.." })
        }

        // generate unique transactionId
        const transactionId = "TXN-" + Date.now() + "-" + Math.random().toString(36).substring(2, 8).toUpperCase()

        const savedPayment = await paymentModel.create({
            propertyId,
            buyerId,
            ownerId: property.ownerId,
            amount,
            paymentMethod,
            transactionId,
            status: "Pending",
        })

        res.status(201).json({
            message: "Payment initiated successfully!!",
            data: savedPayment,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while creating payment..",
            err: err.message,
        })
    }
}

// ===================== UPDATE PAYMENT STATUS (ADMIN) =====================
const updatePaymentStatus = async (req, res) => {
    try {
        const id = req.params.id
        const { status } = req.body

        const validStatuses = ["Pending", "Completed", "Failed"]
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status.." })
        }

        const updated = await paymentModel.findByIdAndUpdate(id, { status }, { new: true })
        if (!updated) {
            return res.status(404).json({ message: "Payment not found.." })
        }

        // if payment completed --> mark property as Sold/Rented
        if (status === "Completed") {
            const property = await propertyModel.findById(updated.propertyId)
            if (property) {
                const newStatus = property.listingType === "Sale" ? "Sold" : "Rented"
                await propertyModel.findByIdAndUpdate(updated.propertyId, { status: newStatus })
            }
        }

        res.json({
            message: "Payment status updated successfully!!",
            data: updated,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while updating payment..",
            err: err.message,
        })
    }
}

// ===================== GET MY PAYMENTS (BUYER) =====================
const getMyPayments = async (req, res) => {
    try {
        const buyerId = req.user._id

        const payments = await paymentModel
            .find({ buyerId })
            .populate("propertyId", "title price listingType images")
            .populate("ownerId", "firstName lastName email phone")
            .sort({ createdAt: -1 })

        res.json({
            message: "My payments fetched successfully!!",
            count: payments.length,
            data: payments,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while fetching payments..",
            err: err.message,
        })
    }
}

// ===================== GET ALL PAYMENTS (ADMIN) =====================
const getAllPayments = async (req, res) => {
    try {
        const filter = {}
        if (req.query.status) filter.status = req.query.status

        const payments = await paymentModel
            .find(filter)
            .populate("propertyId", "title price listingType")
            .populate("buyerId", "firstName lastName email")
            .populate("ownerId", "firstName lastName email")
            .sort({ createdAt: -1 })

        // total revenue calculation
        const completedPayments = payments.filter((p) => p.status === "Completed")
        const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0)

        res.json({
            message: "All payments fetched successfully!!",
            count: payments.length,
            totalRevenue,
            data: payments,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while fetching all payments..",
            err: err.message,
        })
    }
}

module.exports = { createPayment, updatePaymentStatus, getMyPayments, getAllPayments }
