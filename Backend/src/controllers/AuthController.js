const userModel = require("../models/UserModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cloudinaryUtils = require("../utils/cloudinaryUtils")

const secret = process.env.JWT_SECRET || "real_estate_secret_key"

// ===================== REGISTER =====================
const register = async (req, res) => {
    console.log("req.file", req.file)
    console.log("req.body", req.body)

    try {
        const { firstName, lastName, email, password, phone, role, gender, address, city, state, pincode } = req.body

        // check if email already exists
        const existingUser = await userModel.findOne({ email: email })
        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered. Please login..",
            })
        }

        // encrypt password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10)

        // handle profile picture upload to cloudinary
        let profilePicUrl = ""
        if (req.file) {
            const cloudResponse = await cloudinaryUtils.uploadToCloud(req.file.path)
            profilePicUrl = cloudResponse.secure_url
        }

        // create user
        const savedUser = await userModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            role: role || "BUYER",
            gender,
            address,
            city,
            state,
            pincode,
            profilePic: profilePicUrl,
        })

        res.status(201).json({
            message: "User registered successfully!!",
            data: {
                _id: savedUser._id,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                role: savedUser.role,
            },
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while registering user..",
            err: err.message,
        })
    }
}

// ===================== LOGIN =====================
const login = async (req, res) => {
    console.log("req.body login", req.body)

    try {
        const { email, password } = req.body

        // find user by email
        const user = await userModel.findOne({ email: email })
        if (!user) {
            return res.status(404).json({
                message: "User not found. Please register..",
            })
        }

        // check if user is active
        if (!user.isActive) {
            return res.status(403).json({
                message: "Your account has been blocked. Contact support..",
            })
        }

        // compare password with hashed password
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Invalid password..",
            })
        }

        // generate JWT token
        const tokenPayload = {
            _id: user._id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
        }
        const token = jwt.sign(tokenPayload, secret, { expiresIn: "7d" })

        res.json({
            message: "Login successful!!",
            token: token,
            data: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                profilePic: user.profilePic,
                phone: user.phone,
            },
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while login..",
            err: err.message,
        })
    }
}

// ===================== GET MY PROFILE =====================
const getMyProfile = async (req, res) => {
    try {
        // req.user is set by AuthMiddleware
        const user = await userModel.findById(req.user._id).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found.." })
        }
        res.json({
            message: "Profile fetched successfully!!",
            data: user,
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while fetching profile..",
            err: err.message,
        })
    }
}

// ===================== CHANGE PASSWORD =====================
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body
        const userId = req.user._id

        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found.." })
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Old password is incorrect.." })
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10)
        await userModel.findByIdAndUpdate(userId, { password: hashedNewPassword })

        res.json({ message: "Password changed successfully!!" })
    } catch (err) {
        res.status(500).json({
            message: "Error while changing password..",
            err: err.message,
        })
    }
}

module.exports = {
    register,
    login,
    getMyProfile,
    changePassword,
}
