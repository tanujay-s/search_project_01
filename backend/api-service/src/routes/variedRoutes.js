const express = require('express');
const { addLinksToCrawl } = require('../controllers/variedController');

const router = express.Router();

router.post('/add_links_to_crawl', addLinksToCrawl);

module.exports = router;