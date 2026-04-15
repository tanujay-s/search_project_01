const express = require('express');
const { addLinksToCrawl, fetchTrendingArticles } = require('../controllers/variedController');

const router = express.Router();

router.post('/add_links_to_crawl', addLinksToCrawl);

router.get('/fetch_trending_articles', fetchTrendingArticles);

module.exports = router;