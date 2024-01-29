'use strict';
var host = 'https://search-amcart-search-tonjytti7flgc6lahxabe74jzi.us-east-1.es.amazonaws.com';

// Create a client with SSL/TLS enabled.
var { Client } = require('@opensearch-project/opensearch');
var fs = require('fs');
const client = new Client({
    ssl: {
        rejectUnauthorized: false,
    },
    node: host,
    auth: {
        username: 'suraj',
        password: 'Pass@1234',
    },
});

module.exports = client;