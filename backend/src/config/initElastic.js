const client = require('./elastic');

async function initElastic() {
    const indexName = 'pages';
    const exists = await client.indices.exists({
        index: indexName
    });

    if (!exists) {
        console.log("Creating elastic search index");
        await client.indices.create({
            index: indexName,
            mappings: {
                properties: {
                    title: { type: "text" },
                    content: { type: "text" }
                }
            }
        });

        console.log('Index Created');
    } else {
        console.log('Index already exist');
    }
}

module.exports = initElastic;