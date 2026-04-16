const { addLinksToDb } = require('../services/variedService');
const { fetchAndUpdateArticle, fetchAndUpdateRepos } = require('../services/trendingService');

async function addLinksToCrawl(req, res, next) {
    try {
        /* links from body
        will come in array always so multiple 
        links can be updated at a time if needed
        */
        const { links } = req.body;
        
        if (!links || !Array.isArray(links) || links.length === 0) {
            throw new Error('Links not provided');
        }

        await Promise.all(
            links.map(link => addLinksToDb(link))
        )

        return res.status(200).json({message: 'Links Added Successfully'});

    } catch (err) {
        next(err);
    }
}

async function fetchTrendingArticles(req, res, next) {
    try {
        const articles = await fetchAndUpdateArticle();

        res.json(articles);

    } catch (err) {
        next(err);
    }
}

async function fetchTrendingRepos(req, res, next) {
    try {
        const repos = await fetchAndUpdateRepos();

        res.json(repos);
    } catch(err){
        next(err);
    }
}

module.exports = { addLinksToCrawl, fetchTrendingArticles, fetchTrendingRepos };