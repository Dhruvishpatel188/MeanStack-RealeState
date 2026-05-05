const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
dotenv.config()

// create object | reference of express
const app = express()

// global middlewares
app.use(cors()) // all ports are allowed
app.use(express.json()) // accept JSON body globally

// require dbConnection file and get connection here...
const dbConnection = require("./src/utils/dbConnection")
// call dbConnection function
dbConnection.dbConnection()

// ===================== ROUTES IMPORT =====================
const authRoutes = require("./src/routes/AuthRoutes")
app.use("/api/auth", authRoutes)

const userRoutes = require("./src/routes/UserRoutes")
app.use("/api/user", userRoutes)

const propertyRoutes = require("./src/routes/PropertyRoutes")
app.use("/api/property", propertyRoutes)

const inquiryRoutes = require("./src/routes/InquiryRoutes")
app.use("/api/inquiry", inquiryRoutes)

const visitRoutes = require("./src/routes/PropertyVisitRoutes")
app.use("/api/visit", visitRoutes)

const favoriteRoutes = require("./src/routes/FavoriteRoutes")
app.use("/api/favorite", favoriteRoutes)

const reviewRoutes = require("./src/routes/ReviewRoutes")
app.use("/api/review", reviewRoutes)

const paymentRoutes = require("./src/routes/PaymentRoutes")
app.use("/api/payment", paymentRoutes)

const supportRoutes = require("./src/routes/SupportTicketRoutes")
app.use("/api/support", supportRoutes)

// static folder for local uploads
app.use("/uploads", express.static("uploads"))

// server create
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Real Estate server started on PORT ${PORT}`)
})
