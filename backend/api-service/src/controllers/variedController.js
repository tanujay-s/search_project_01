const { addLinksToDb } = require('../services/variedService');

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

module.exports = { addLinksToCrawl };