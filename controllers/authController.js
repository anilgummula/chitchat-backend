const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require("../models/user");


const register = async (req,res)=>{
    try{
        const {name,email,mobile,password} = req.body;
        const user = await UserModel.findOne({email});
        if(user){
            // console.log("user exist check");
            return res.status(409)
            .json({message: "User already exist,you can login",success: false})
        }
        const userModel = new UserModel({name,email,mobile,password});
        userModel.password = await bcrypt.hash(password,10);
        await userModel.save();


        const jwtToken = jwt.sign(
            {email : email,mobile:mobile},
            process.env.JWT_SECRET,
            { expiresIn: "24h"}
        )
        res.status(201)
        .json({
            jwtToken,
            message : "Registration Successfull",
            success : true    
        })
    }catch(err){
        res.status(500)
        .json({
            message : "Internal server error",
            success : false    
        })
    }
}

const login = async (req,res)=>{
    try{
        // console.log("login validation");
        const {email,password} = req.body;
        const user = await UserModel.findOne({email});
        // console.log("user data: ",!user);
        const errMesg = "Auth Failed email or password is wrong! ";
        if(!user){
            // console.log("user not found...");
            return res.status(403)
            .json({message: errMesg,success: false})
        }
        const isPassEqual = await bcrypt.compare(password,user.password);
        if(!isPassEqual){
            return res.status(403)
            .json({message: errMesg,success: false})
        }

        const jwtToken = jwt.sign(
            {email : user.email, _id : user._id },
            process.env.JWT_SECRET,
            { expiresIn: "24h"}
        )

        res.status(200)
        .json({
            message : "Login Successfull",
            success : true ,
            jwtToken,
            email,
            mobile: user.mobile,
            name : user.name
        })
        
    }catch(err){
        res.status(500)
        .json({
            message : "Internal server error",
            success : false    
        })
    }
}

module.exports = {
    register,
    login
}