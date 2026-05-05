const cloudinary = require("cloudinary").v2

// cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadToCloud = async (filePath) => {
    const response = await cloudinary.uploader.upload(filePath, {
        folder: "real_estate",
    })
    return response
}

const uploadMultipleToCloud = async (filePaths) => {
    const uploadPromises = filePaths.map((path) =>
        cloudinary.uploader.upload(path, { folder: "real_estate/properties" })
    )
    const results = await Promise.all(uploadPromises)
    return results.map((r) => r.secure_url)
}

const deleteFromCloud = async (publicId) => {
    const response = await cloudinary.uploader.destroy(publicId)
    return response
}

module.exports = {
    uploadToCloud,
    uploadMultipleToCloud,
    deleteFromCloud,
}
