const pool = require('../config/db');

async function fetchArticlesForDashboard() {
    try {
        const result = await pool.query(`
            SELECT title, description, url, source, published_at
            FROM external_articles
            ORDER BY published_at DESC
            LIMIT 5
        `);

        // console.log(result);

        return result.rows;
    } catch (err) {
        console.error('Error fetching latest articles: ', err);
        return [];
    }
}

async function fetchAllDashboardData() {
    try {
        const articles = await fetchArticlesForDashboard();

        return {
            latestArticles: articles,
            trendingRepos: [],
            notes: [],
            snippets: [],
            savedItems: []
        };

    } catch (err) {
        console.error("Error getting dashboard data: ", err);
        return {
            latestArticles: [],
            trendingRepos: [],
            notes: [],
            snippets: [],
            savedItems: []
        };
    }
}

module.exports = { fetchAllDashboardData };