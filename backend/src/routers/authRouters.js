const express = require('express');
const { login, loginQRCode, register } = require('../controllers/authControllers');
const router = express.Router();

router.post('/login', login);
router.post('/login-qr', loginQRCode);
router.post('/register', register); // เส้นทางสำหรับการลงทะเบียนผู้ใช้ใหม่

module.exports = router;
