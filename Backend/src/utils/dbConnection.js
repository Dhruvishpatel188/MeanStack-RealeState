// require package mongoose
const mongoose = require("mongoose")

const dbConnection = () => {
    // mongodb://127.0.0.1:27017 == localhost
    // real_estate_db --> if database is available it will connect with it
    // if database is not available it will create itself and then connect
    mongoose
        .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/real_estate_db")
        .then(() => {
            console.log("Database connected successfully...")
        })
        .catch((err) => {
            console.log("Database not connected...", err.message)
        })
}

// need to call this function in app.js --> app is your main file
// so need to export this function from this file
module.exports = {
    dbConnection,
}
