const client = require('./opensearch-client');

const searchProducts = function (req, res) {

    const body = getRequestBody(req, 'search');
    console.log('search:' + JSON.stringify(body));
    client.searchTemplate({
        index: 'product',
        body: body
    }, function (err, data) {
        if (err) {
            console.log(err)
            res.send({
                success: false,
                message: err
            });
        } else {
            res.send({
                success: true,
                products: data.body.hits.hits.map(x => x._source),
                totalRecords: data.body.hits.total.value
            });
        }
    });
}

const getRequestBody = function (req, suffix) {    
    if (req.query.category && req.query.subCategory) {
        return {
            id: `category-subcategory-${suffix}`,
            params: {
                mainCategory: req.query.category,
                subCategory: req.query.subCategory,
                from: req.query.from
            }
        }
    }
    else if (req.query.category) {
        return {
            id: `main-category-${suffix}`,
            params: {
                query: req.query.category,
                from: req.query.from
            }
        };
    }
    else {
        return {
            id: `wildcard-${suffix}`,
            params: {
                query: req.query.query,
                from: req.query.from
            }
        };
    }
}

module.exports = { searchProducts };
