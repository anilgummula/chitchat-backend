const UserModel = require("../models/user");
const ConModel = require('../models/connections')



const connections = async (req, res) => {
    try {
        const { email, name } = req.body;
        const cids = await ConModel.findOne({ name });

        res.status(200).json({ message: "Connection found", data: cids });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch connections" });
    }
};

const details = async (req, res) => {
    try {
        const { usermail } = req.body;
        const data = await UserModel.findOne({ usermail });

        console.log("data: ",data);
        
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

module.exports = {connections, networks,details};