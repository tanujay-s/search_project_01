const pool = require('../config/db');
const {indexDocument} = require('../services/searchService');

async function indexPending(req, res, next) {
    try {
        const result = await pool.query(
            `SELECT * FROM crawled_pages
            WHERE status = 'completed' AND indexed = FALSE`
        )

        for (const page of result.rows) {
            await indexDocument(page.id, {
                url: page.url,
                title: page.title,
                meta_description: page.meta_description,
                content: page.content,
                h1_tags: page.h1_tags
            });

            await pool.query(
                "UPDATE crawled_pages SET indexed=TRUE WHERE id=$1",
                [page.id]
            );
        }

        res.json({ message: "Indexing completed" });

    } catch (err) {
        next(err);
    }
}

module.exports = { indexPending }