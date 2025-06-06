const Message = require("../models/message");
const User = require("../models/user");

const getUserForSidebar = async (req,res)=>{
    try {
        const loggedInUser = req.user._id;
        const filteredUsers= await User.find({_id:{$ne:loggedInUser}}).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUserForSidebar: ",error.message);
        res.status(500).json({error:"Internal server error"})
    }
}

const getMessages = async (req,res)=>{
    try {
        const {id:userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        })
        res.status(200).json(messages);

    } catch (error) {
         console.error("Error in getMessages controller: ",error.message);
        res.status(500).json({error:"Internal server error"})
    }
}

const sendMessage = async (req,res)=>{
    try {
        const {text,image} = req.body;
        const {id:receiverId} =req.params;
        const senderId = req.user._id;


        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        });

        await newMessage.save();

        //scoket.io later

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error at sendMessage controller: ",error.message);
        res.status(500).json({error:"Internal server error"})
    }
}


module.exports = {getUserForSidebar,getMessages,sendMessage};