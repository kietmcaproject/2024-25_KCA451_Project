const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');
const wrapAsync = require("../utils/wrapAsync.js");
const { isAdmin, isLoggedIn } = require('../middleware');

router.get('/chat', isLoggedIn, async (req, res) => {
    let chatMessages = await Chat.find({}).populate("userId");
    // console.log(chatMessages);
    res.render('chats/livechat.ejs', {currUser: req.user, chatMessages});
});

// // Admin Panel to view chats
// router.get('/admin/chats', isAdmin, wrapAsync(async (req, res) => {
//     const chats = await Chat.find({}).populate('userId');
//     res.render('chats/adminpanel', { chats });
// }));

module.exports = router;
