const express = require("express");
const { ensureAuthenticated } = require("../middlewares/auth");
const { getUserForSidebar, getMessages, sendMessage } = require("../controllers/message.controller");

const router = express.Router();

router.get("/users",ensureAuthenticated,getUserForSidebar);
router.get("/:id",ensureAuthenticated,getMessages);
router.post("/send/:id",ensureAuthenticated,sendMessage);

module.exports =router;