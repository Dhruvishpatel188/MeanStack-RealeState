const multer = require("multer")
const path = require("path")

// disk storage -- saves file locally first, then upload to cloudinary
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/") // make sure uploads/ folder exists
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9)
        cb(null, uniqueName + path.extname(file.originalname))
    },
})

// file filter --> only images allowed
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error("Only image files are allowed (jpeg, png, jpg, webp)"), false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
})

module.exports = { upload }
