const userModel = require("../models/UserModel")
const bcrypt = require("bcrypt")
const cloudinaryUtils = require("../utils/cloudinaryUtils")

// ===================== GET ALL USERS (ADMIN) =====================
const getAllUsers = async (req, res) => {
    try {
        // support filtering by role, city, isActive
        const filter = {}
        if (req.query.role) filter.role = req.query.role
        if (req.query.city) filter.city = req.query.city
        if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === "true"

        const users = await userModel.find(filter).select("-password")
        res.json({
            message: "Users fetched successfully!!",
            count: users.length,
            data: users,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while fetching users..",
            err: err.message,
        })
    }
}

// ===================== GET SINGLE USER BY ID =====================
const getUserById = async (req, res) => {
    try {
        const id = req.params.id
        const user = await userModel.findById(id).select("-password")
        if (user) {
            res.json({
                message: "User fetched successfully!!",
                data: user,
            })
        } else {
            res.status(404).json({ message: "User not found.." })
        }
    } catch (err) {
        res.status(500).json({
            message: "Error while fetching user..",
            err: err.message,
        })
    }
}

// ===================== UPDATE USER PROFILE =====================
const updateUser = async (req, res) => {
    const id = req.params.id
    console.log("req.file update", req.file)
    console.log("req.body update", req.body)

    try {
        let updateData = { ...req.body }

        // if new profile pic uploaded --> upload to cloudinary
        if (req.file) {
            const cloudResponse = await cloudinaryUtils.uploadToCloud(req.file.path)
            updateData.profilePic = cloudResponse.secure_url
        }

        // don't allow role update from this route for safety
        delete updateData.password
        delete updateData.role

        const updatedUser = await userModel.findByIdAndUpdate(id, updateData, { new: true }).select("-password")
        if (updatedUser) {
            res.json({
                message: "User updated successfully!!",
                data: updatedUser,
            })
        } else {
            res.status(404).json({ message: "User not found.." })
        }
    } catch (err) {
        res.status(500).json({
            message: "Error while updating user..",
            err: err.message,
        })
    }
}

// ===================== BLOCK / UNBLOCK USER (ADMIN) =====================
const toggleUserStatus = async (req, res) => {
    try {
        const id = req.params.id
        const user = await userModel.findById(id)

        if (!user) {
            return res.status(404).json({ message: "User not found.." })
        }

        // toggle isActive status
        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            { isActive: !user.isActive },
            { new: true }
        ).select("-password")

        res.json({
            message: `User ${updatedUser.isActive ? "activated" : "blocked"} successfully!!`,
            data: updatedUser,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while updating user status..",
            err: err.message,
        })
    }
}

// ===================== DELETE USER (ADMIN) =====================
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id
        const deletedUser = await userModel.findByIdAndDelete(id)

        if (deletedUser) {
            res.json({
                message: "User deleted successfully!!",
                data: deletedUser,
            })
        } else {
            res.status(404).json({ message: "User not found.." })
        }
        console.log("deleted user id:", id)
    } catch (err) {
        res.status(500).json({
            message: "Error while deleting user..",
            err: err.message,
        })
    }
}

// ===================== CHANGE USER ROLE (ADMIN) =====================
const changeUserRole = async (req, res) => {
    try {
        const id = req.params.id
        const { role } = req.body

        const validRoles = ["ADMIN", "AGENT", "OWNER", "BUYER", "SUPPORT"]
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role provided.." })
        }

        const updatedUser = await userModel.findByIdAndUpdate(id, { role }, { new: true }).select("-password")
        if (updatedUser) {
            res.json({
                message: "User role updated successfully!!",
                data: updatedUser,
            })
        } else {
            res.status(404).json({ message: "User not found.." })
        }
    } catch (err) {
        res.status(500).json({
            message: "Error while changing user role..",
            err: err.message,
        })
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    toggleUserStatus,
    deleteUser,
    changeUserRole,
}
