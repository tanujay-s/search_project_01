const express = require('express');
const { search, deleteIndex } = require('../controllers/searchController');
const { indexPending } = require('../controllers/indexingController');

const router = express.Router();

router.get('/search', search);
router.post('/delete_index', deleteIndex);
router.post("/index-pending", indexPending);

router.get('/health', (req, res) =>{
    res.send('Ok');
});

module.exports = router;