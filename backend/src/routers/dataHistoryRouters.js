const express = require('express');
const { dataHistory } = require('../controllers/dataHistoryControllers');
const router = express.Router();

router.get('/history', dataHistory);

module.exports = router;
