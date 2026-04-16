const express = require('express');
const { dashboard } = require('../controllers/devController');

const router = express.Router();

router.get('/dashboard', dashboard);

module.exports = router;