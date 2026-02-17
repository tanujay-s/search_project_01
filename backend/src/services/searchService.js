const client = require('../config/elastic');

// async function searchQuery(query) {
//     const result = await client.search({
//         index: 'pages',
//         query: {
//             match: {
//                 content: query
//             }
//         }
//     });
//     return result.hits.hits;
// }
async function searchQuery(query) {
  const result = await client.search({
    index: 'pages',
    query: {
      multi_match: {
        query: query,
        fields: ['title', 'content']
      }
    }
  });


  return result.hits.hits.map(hit => hit._source);
}

async function indexDocument(doc) {
  await client.index({
    index: 'pages',
    document: doc,
    refresh: true
  });
}

module.exports = { searchQuery, indexDocument };