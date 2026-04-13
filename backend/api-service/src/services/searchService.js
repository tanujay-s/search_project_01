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

async function searchQuery(query, page = 1, limit = 10) {
  try {
    const from = (page - 1) * limit;

    const result = await client.search({
      index: 'pages',
      from,
      size: limit,
      query: {
        bool: {
          should: [
            {
              match_phrase: {
                title: { query, boost: 6 }
              }
            },
            {
              match: {
                title: { query, boost: 4, fuzziness: "AUTO" }
              }
            },
            {
              match: {
                h1_tags: { query, boost: 3 }
              }
            },
            {
              match: {
                content: { query, fuzziness: "AUTO" }
              }
            }
          ]
        }
      },
      highlight: {
        fields: {
          content: {}
        }
      }
    });

    const total = result.hits.total.value;

    return {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      results: result.hits.hits.map(hit => ({
        id: hit._id,
        score: hit._score,
        title: hit._source.title,
        url: hit._source.url,
        snippet:
          hit.highlight?.content?.[0] ||
          hit._source.content?.slice(0, 200) + "..."
      }))
    };

  } catch (err) {
    if (err.meta?.body?.error?.type === "index_not_found_exception") {
      return { total: 0, page: 1, totalPages: 0, results: [] };
    }
    throw err;
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