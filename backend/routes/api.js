const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.post('/chat', apiController.chatBot);

module.exports = router;
