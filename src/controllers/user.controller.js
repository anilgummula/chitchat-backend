const UserModel = require("../models/user");
const ConModel = require('../models/connections')
const RequestModel = require('../models/request')
const mongoose = require('mongoose');



const connections = async (req, res) => {
    try {
        const { email } = req.body;
        const userModel = await UserModel.findOne({email:email});
        const userId = userModel._id;
        console.log("userid: ",userId);
        
        const cons = await ConModel.findOne({ id:userId });
        console.log("conn: ", cons);
        // const cids = cons.cids;

        if (!cons || !cons.cids || cons.cids.length === 0) {
            return res.status(200).json({ message: "No connections", data: [] });
        }

        // If cids is an array of userIds
        let conUserInfo = await UserModel.find({ _id: { $in: cons.cids } });

        // const conUserInfo = await UserModel.findOne({_id:cids})
        console.log("conn id info at index : ",conUserInfo);
        
        

        res.status(200).json({ message: "Connections found", data: conUserInfo });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch connections" });
    }
};

const details = async (req, res) => {
    try {
        const { usermail } = req.body;
        // console.log("usermail: ",usermail);
        const data = await UserModel.findOne({ email:usermail });

        // console.log("data: ",data);
        
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch profile..." });
    }
};

// const networks = async (req,res)=>{
//     try{
//         const {email} = req.body;
//         const networkdata = await UserModel.find();
        
//         res.status(201).json(networkdata);
//     }
//     catch (error) {
//         res.status(500).json({ error: 'Failed to fetch networks 123' });
//     }

// };

const networks = async (req, res) => {
    try {
        const { email } = req.body;

        // 1. Find the logged-in user by email
        const loggedInUser = await UserModel.findOne({ email });

        if (!loggedInUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // 2. Get the user's connections
        const connectionDoc = await ConModel.findOne({ id: loggedInUser._id });

        // If connectionDoc doesn't exist, just exclude the logged-in user
        const excludeIds = connectionDoc ? [loggedInUser._id, ...connectionDoc.cids] : [loggedInUser._id];

        // 3. Fetch all users except the logged-in user and their connections
        const networkData = await UserModel.find({ _id: { $nin: excludeIds } });

        res.status(200).json(networkData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch networks' });
    }
};

const request = async (req,res)=>{
    try{
        const {rid,id,name,email} = req.body;
        const requestModel = new RequestModel({id:id,rid:rid,name:name,email:email});
        await requestModel.save();
        res.status(201).json({message:"successfully sent",success:true});
        console.log("success in request set");
        
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch networks 123' });
    }

};

const notifications = async (req,res)=>{
    try{
        const id = req.body.id;
   // Convert string ID to ObjectId
        // const objectId = new mongoose.Types.ObjectId(id);

        // Query using correct ObjectId type
        console.log("id sent to backend:",id);
        
        let filteredRequests = [];
        const requests = await RequestModel.find({ id:id });
        for(let i=0;i<requests.length;i++){
            if(requests[i].status!=true){
                filteredRequests.push(requests[i]);
            }
        }

        console.log("requests after filter: ", filteredRequests);;
        // const requests = await RequestModel.find({ id:id });
        // await requestModel.save();
        // console.log("requests: " ,requests);
        
        res.status(200).json({message:"successfully sent",data:filteredRequests});
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }

};

// const reacts = async (req,res)=>{
//     try{
//         const {rid,myid} = req.body;
//         console.log("reacts ids :  ",rid,myid);

//         const requestModel = await RequestModel.findOne({id:myid,rid:rid});
//         console.log("requestmodel :",requestModel);
        
//         requestModel.status=true;
//         requestModel.accept=true;
//         await requestModel.save();
//         await RequestModel.findOneAndDelete({id:myid,rid:rid})
        


//         await ConModel.updateOne({ id: myid },{ $addToSet: { cids: rid } });
//         await ConModel.updateOne({ id: rid },{ $addToSet: { cids: myid } });

//         console.log("success set true");
        
//         res.status(201).json({message:"successfully sent"});
//     }
//     catch (error) {
//         res.status(500).json({ error: 'Failed to fetch networks 123' });
//     }

// };
const reacts = async (req, res) => {
    try {
        const { rid, myid } = req.body;
        console.log("Reacting to request from:", rid, "to:", myid);

        // Find and delete the request in a single operation
        const requestModel = await RequestModel.findOneAndDelete({ id: myid, rid: rid });

        if (!requestModel) {
            return res.status(404).json({ error: 'Request not found or already handled' });
        }

        // Add each user to the other's connections
        await ConModel.updateOne({ id: myid }, { $addToSet: { cids: rid } }, { upsert: true });
        await ConModel.updateOne({ id: rid }, { $addToSet: { cids: myid } }, { upsert: true });

        console.log("Connection established and request deleted");

        res.status(201).json({ message: "Successfully connected and request deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to react to request' });
    }
};

const userInfo = async (req,res)=>{
    try {
        const {id:userid} = req.params;
        
        const userInfos = await UserModel.findOne({_id:userid});
        res.status(200).json(userInfos);

    } catch (error) {
        console.log("error at userInfo: ",error.message);
        res.status(500).json({error:"intenal server error"})
    }
}

module.exports = {connections, networks,details,request,reacts,notifications,userInfo};