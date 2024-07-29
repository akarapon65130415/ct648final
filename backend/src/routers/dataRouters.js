const express = require('express');
const { dataEmployee } = require('../controllers/dataControllers');
const router = express.Router();

router.get('/employees', dataEmployee);

module.exports = router;
