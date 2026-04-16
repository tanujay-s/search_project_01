const pool = require('../config/db');

async function fetchFromDevTo() {
    try {
        const res = await fetch("https://dev.to/api/articles?per_page=10");
        const data = await res.json();

        return data.map(item => ({
            title: item.title,
            description: item.description,
            url: item.url,
            publishedAt: item.published_at
        }));

    } catch (err) {
        console.error("Error fetching Dev.to:", err);
        return [];
    }
}

async function saveArticles(articles) {
    try{
        if (!articles || articles.length === 0) return;

        const values = [];
        const placeholders = [];

        articles.forEach((article, index) => {
            const baseIndex = index * 7;

            placeholders.push(
                `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, 
                  $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6}, $${baseIndex + 7})`
            );

            values.push(
                article.title,
                article.description,
                article.url,
                article.source || "dev.to",
                article.author || null,
                article.tags || [],
                article.publishedAt
            );
        });

        const query = `
            INSERT INTO external_articles
            (title, description, url, source, author, tags, published_at)
            VALUES ${placeholders.join(",")}
            ON CONFLICT (url) DO NOTHING
        `;

        await pool.query(query, values);

        console.log(`Saved ${articles.length} articles`);

    } catch(err){
        console.error("Error in saving data in database: ",err);
    }
}

async function fetchAndUpdateArticle() {
    const articles = await fetchFromDevTo();

    await saveArticles(articles);

    return articles;
}

async function fetchFromGithub() {
    try {
        const res = await fetch("https://api.github.com/search/repositories?q=stars:>10000&sort=stars&order=desc&per_page=5");
        const data = await res.json();
        
        return data.items.map(repo => ({
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description,
            url: repo.html_url,
            stars: repo.stargazers_count,
            language: repo.language
        }));

    } catch(err){
        console.log('Error fetching repos from github: ',err);
        return [];
    }
}

async function saveRepos(repos) {
    try{
        if(!repos || repos.length == 0) return;

        await pool.query(`DELETE FROM trending_repos`);

        const values = [];
        const placeholders = [];

        repos.forEach((repo, index) => {
            const baseIndex = index * 6;

            placeholders.push(
                `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3},
                    $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6}
                )`
            );
            values.push(
                repo.name,
                repo.fullName,
                repo.description,
                repo.url,
                repo.stars,
                repo.language
            );
        });

        const query = `INSERT INTO trending_repos
            (name, full_name, description, url, stars, language)
            VALUES ${placeholders.join(",")} 
            ON CONFLICT (url) DO NOTHING `;

        await pool.query(query, values);

        console.log('Repos table updated');
        
    } catch(err) {
        console.error('Error updating repos db: ', err);
    }
}

async function fetchAndUpdateRepos() {
    const repos = await fetchFromGithub();

    await saveRepos(repos);

    return repos;
}

module.exports = { fetchAndUpdateArticle, fetchAndUpdateRepos };