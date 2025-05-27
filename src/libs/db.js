const mongoose = require('mongoose');
// mongodb+srv://anilstark2050:TN3uh5WXLp5UC4oz@chitchat.3wwm6.mongodb.net/?retryWrites=true&w=majority&appName=chitchat


const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
        
    }catch(error){
        console.log(`MongoDB connection error:`,error);
    }
}
module.exports = connectDB;