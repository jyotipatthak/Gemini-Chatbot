const express = require('express');
const router = express.Router();
const { createNewChat, postMessage } = require('../controllers/chatController');

router.post('/new', createNewChat);
router.post('/:chatId/message', postMessage);

module.exports = router;