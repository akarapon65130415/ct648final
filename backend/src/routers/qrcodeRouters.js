const express = require('express');
const { generateAccessCode, verifyQRCode } = require('../controllers/qrcodeControllers');
const router = express.Router();

router.post('/generate', generateAccessCode);
router.post('/verify', verifyQRCode);

module.exports = router;
