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
const dbConnection = require("./src/utils/dbConnection.js")
// call dbConnection function
dbConnection.dbConnection()

const userRoutes = require("./src/routes/UserRoutes")
app.use("/api/user", userRoutes)
