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

async function deleteById({id, index}) {
  try {
    const result = await client.delete({
      id, index
    })
    return result;
  } catch (err) {
    throw err;
  }
}

async function searchQuery(query) {
  try {
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
  } catch (err) {
    if (err.meta?.body?.error?.type === "index_not_found_exception") {
      return [];
    }
    // next(err);
  }

}

async function indexDocument(doc) {
  await client.index({
    index: 'pages',
    document: doc,
    refresh: true
  });
}

module.exports = { searchQuery, indexDocument, deleteById };