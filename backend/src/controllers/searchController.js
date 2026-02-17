const { searchQuery, indexDocument } = require('../services/searchService');

async function search(req, res) {
    try {
        const q = req.query.q;
        console.log(q);
        const result = await searchQuery(q);

        res.json(result);

    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

async function index(req, res) {
  try {
    await indexDocument(req.body);
    res.json({ message: "Document indexed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { search, index };