const mongoose = require('mongoose')

const databaseConnect = async () => {
    try {

        const conn = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`Connected to DB: ${conn.connection.host}`);
        
    } catch (error) {
        console.error("ERROR :", error);
        process.exit(1);
    }
}

module.exports= databaseConnect;