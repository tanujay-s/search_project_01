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
          fields: ['title^3', 'content'],
          fuzziness: "AUTO"
        }
      },
      highlight: {
        fields: {
          content: {}
        }
      }
    });
    // return result.hits.hits.map(hit => hit._source);
    return result.hits.hits.map(hit => ({
      id: hit._id,
      score: hit._score,
      title: hit._source.title,
      url: hit._source.url,
      snippet: hit.highlight?.content?.[0] ||
        hit._source.content.substring(0, 200)
    }));
  } catch (err) {
    if (err.meta?.body?.error?.type === "index_not_found_exception") {
      return [];
    }
    // next(err);
  }

}

async function indexDocument(id, doc) {
  await client.index({
    index: 'pages',
    id: id,
    document: doc
  });
}

module.exports = { searchQuery, indexDocument, deleteById };