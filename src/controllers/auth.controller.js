const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require("../models/user");
const ConModel = require("../models/connections");


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

        //for connections
        const userAfter = await UserModel.findOne({email});
        const conModelCreate = new ConModel({id:userAfter._id,cids:[]});
        await conModelCreate.save();


        const jwtToken = jwt.sign(
            {email : email,mobile:mobile},
            process.env.JWT_SECRET,
            { expiresIn:"7d"}
        )
        res.status(201)
        .json({
            jwtToken,
            message : "Registration Successfull",
            success : true,
            userid: userAfter._id,
            name:name
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

        //for connetions
        const userAfter = await UserModel.findOne({email});
        const conModelCreate = new ConModel({id:userAfter._id,cids:[]});
        await conModelCreate.save();

        const jwtToken = jwt.sign(
            {email : user.email, _id : user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d"}
        )
        const userid = user._id;
        console.log("userid: ",userid);
        

        res.status(200)
        .json({
            message : "Login Successfull",
            success : true ,
            jwtToken,
            email,
            mobile: user.mobile,
            name : user.name,
            userid : userid
        })
        
    }catch(err){
        res.status(500)
        .json({
            message : "Internal server error",
            success : false    
        })
    }
}

const logout = async (req,res)=>{
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
            { expiresIn: "7d "}
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
    login,
    logout
}