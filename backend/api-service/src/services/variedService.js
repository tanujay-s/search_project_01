const pool = require('../config/db');

async function addLinksToDb(url) {
    try {
        await pool.query(
        `INSERT INTO links_to_crawl 
            (url, depth, discovered_from, status)
        VALUES ($1, $2, $3, 'pending')
        ON CONFLICT (url) DO NOTHING
        `,
            [url, 0, null]
        );
    } catch (err) {
        throw err;
    }
}

module.exports = { addLinksToDb };