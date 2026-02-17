const express = require('express');
const { search, index } = require('../controllers/searchController');

const router = express.Router();

router.get('/search', search);
router.post('/index', index);

router.get('/health', (req, res) =>{
    res.send('Ok');
});

module.exports = router;