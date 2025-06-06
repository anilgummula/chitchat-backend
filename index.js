const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();
// require('./config/db.js');
const connectDB = require("./src/libs/db.js");

const authRouter = require('./src/routes/auth.route.js');
const userRouter = require('./src/routes/user.route.js')
const messageRouter = require('./src/routes/message.route.js')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use('/auth',authRouter);
app.use('/user',userRouter);
app.use('/message',messageRouter);

app.listen(PORT,()=>{
    console.log('server running at port: ',PORT); 
    connectDB();
})