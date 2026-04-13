const { searchQuery, deleteById } = require('../services/searchService');

async function search(req, res, next) {
    try {
        const {q, page = 1, limit = 10} = req.query;
        console.log(q);

        if(!q) {
          res.status(400).json({message: "Search string is required"});
        }
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);

        const result = await searchQuery(q, pageNum, limitNum);

        res.json(result);

    } catch(err) {
        // res.status(500).json({error: err.message});
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

module.exports = { search, deleteIndex };