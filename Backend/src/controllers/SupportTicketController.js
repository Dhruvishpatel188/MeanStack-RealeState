const supportTicketModel = require("../models/SupportTicketModel")

// ===================== CREATE SUPPORT TICKET =====================
const createTicket = async (req, res) => {
    console.log("req.body ticket", req.body)
    try {
        const userId = req.user._id
        const { subject, description } = req.body

        const savedTicket = await supportTicketModel.create({ userId, subject, description })
        res.status(201).json({
            message: "Support ticket created successfully!!",
            data: savedTicket,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while creating ticket..",
            err: err.message,
        })
    }
}

// ===================== GET MY TICKETS (USER) =====================
const getMyTickets = async (req, res) => {
    try {
        const userId = req.user._id

        const tickets = await supportTicketModel
            .find({ userId })
            .sort({ createdAt: -1 })

        res.json({
            message: "My tickets fetched successfully!!",
            count: tickets.length,
            data: tickets,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while fetching tickets..",
            err: err.message,
        })
    }
}

// ===================== GET ALL TICKETS (ADMIN/SUPPORT) =====================
const getAllTickets = async (req, res) => {
    try {
        const filter = {}
        if (req.query.status) filter.status = req.query.status

        const tickets = await supportTicketModel
            .find(filter)
            .populate("userId", "firstName lastName email phone")
            .sort({ createdAt: -1 })

        res.json({
            message: "All tickets fetched successfully!!",
            count: tickets.length,
            data: tickets,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while fetching all tickets..",
            err: err.message,
        })
    }
}

// ===================== RESPOND TO TICKET (SUPPORT/ADMIN) =====================
const respondToTicket = async (req, res) => {
    try {
        const id = req.params.id
        const { response, status } = req.body

        const validStatuses = ["Open", "InProgress", "Closed"]
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status.." })
        }

        const updateData = {}
        if (response) updateData.response = response
        if (status) updateData.status = status

        const updated = await supportTicketModel.findByIdAndUpdate(id, updateData, { new: true })
        if (!updated) {
            return res.status(404).json({ message: "Ticket not found.." })
        }

        res.json({
            message: "Ticket updated successfully!!",
            data: updated,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while responding to ticket..",
            err: err.message,
        })
    }
}

// ===================== DELETE TICKET (ADMIN) =====================
const deleteTicket = async (req, res) => {
    try {
        const id = req.params.id
        const deleted = await supportTicketModel.findByIdAndDelete(id)
        if (!deleted) {
            return res.status(404).json({ message: "Ticket not found.." })
        }
        res.json({ message: "Ticket deleted successfully!!", data: deleted })
    } catch (err) {
        res.status(500).json({
            message: "Error while deleting ticket..",
            err: err.message,
        })
    }
}

module.exports = { createTicket, getMyTickets, getAllTickets, respondToTicket, deleteTicket }
