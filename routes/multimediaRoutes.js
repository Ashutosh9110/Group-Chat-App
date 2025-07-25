// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const multimediaController = require('../controllers/multimediaController');
const { authenticate } = require("../middleware/auth");

router.post('/upload', authenticate, upload.single('file'), multimediaController.uploadFileMessage);

module.exports = router;
