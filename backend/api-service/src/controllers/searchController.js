const { searchQuery, indexDocument, deleteById } = require('../services/searchService');

async function search(req, res, next) {
    try {
        const q = req.query.q;
        console.log(q);
        const result = await searchQuery(q);

        res.json(result);

    } catch(err) {
        // res.status(500).json({error: err.message});
        next(err);
    }
}

async function index(req, res, next) {
  try {
    await indexDocument(req.body);
    res.json({ message: "Document indexed" });
  } catch (err) {
    // res.status(500).json({ error: err.message });
    next(err);
  }
}

async function deleteIndex(req, res, next) {
  try {
    await deleteById(req.body);
    res.json({message: "Document deleted"});
  } catch (err) {
    next(err);
  }
}

module.exports = { search, index, deleteIndex };