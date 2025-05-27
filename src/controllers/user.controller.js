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

const networks = async (req,res)=>{
    try{
        const networkdata = await UserModel.find();
        
        res.status(201).json(networkdata);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch networks 123' });
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

const reacts = async (req,res)=>{
    try{
        const {rid,myid} = req.body;
        console.log("reacts ids :  ",rid,myid);
        
        // const usermodel = await UserModel.findOne({id:myid});
        // const useremail = usermodel.email; 
        // console.log("useremail: ",useremail);

        const requestModel = await RequestModel.findOne({id:myid,rid:rid});
        console.log("requestmodel :",requestModel);
        
        requestModel.status=true;
        // await requestModel.save();
        requestModel.accept=true;
        await requestModel.save();
        
        
        // const conModelCreate = new ConModel({id:myid,cids:[ ]});
        // const conModelCreate2 = new ConModel({id:rid,cids:[ ]});
        // await conModelCreate.save();
        // await conModelCreate2.save();

        await ConModel.updateOne({ id: myid },{ $addToSet: { cids: rid } });
        await ConModel.updateOne({ id: rid },{ $addToSet: { cids: myid } });
        // await conModel1.save();
        // await conModel2.save();
        console.log("success set true");
        
        res.status(201).json({message:"successfully sent"});
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch networks 123' });
    }

};

module.exports = {connections, networks,details,request,reacts,notifications};