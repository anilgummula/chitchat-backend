const mongoose = require('mongoose');
// mongodb+srv://anilstark2050:TN3uh5WXLp5UC4oz@chitchat.3wwm6.mongodb.net/?retryWrites=true&w=majority&appName=chitchat

mongoose.connect("mongodb+srv://anilstark2050:TN3uh5WXLp5UC4oz@chitchat.3wwm6.mongodb.net/?retryWrites=true&w=majority&appName=chitchat")
.then(()=>{
    console.log('mongodb connected...');
})
.catch((err)=>{
    console.log("mongodb connection error",err);
})