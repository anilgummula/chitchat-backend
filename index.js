const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();
require('./config/db.js');

const authRouter = require('./routes/auth.route.js');
const userRouter = require('./routes/user.route.js')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use('/auth',authRouter);
app.use('/user',userRouter);

app.listen(PORT,()=>{
    console.log('server running at port: ',PORT); 
})