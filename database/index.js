const mongoose = require("mongoose");

async function connectDatabase() {
    const dbUri = process.env.MONGO_URI;
    try {
        await mongoose.connect(dbUri, { useNewUrlParser: true });
        console.log("Database connection successful");
    } catch (ex) {
        console.error("Error in initiating a database connection", ex.message);
        throw ex;
    }
}

module.exports = connectDatabase;
