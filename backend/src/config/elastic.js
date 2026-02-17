const { Client } = require('@elastic/elasticsearch');

const client = new Client({
    node: process.env.ELASTIC_URL
});

module.exports = client;