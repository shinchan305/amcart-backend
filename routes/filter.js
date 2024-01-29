const client = require('./opensearch-client');

const getFilters = function (req, res) {
debugger;
    const body = getRequestBody(req, 'brands');
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
                data: {
                    filters: [
                        {
                            category: "Brand",
                            items: data.body.aggregations ? data.body.aggregations.distinct_brands.buckets.map(x => { return { id: x.key, value: `${x.key}` } }): []
                        }
                    ]
                }
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
            }
        }
    }
    else if (req.query.category) {
        return {
            id: `main-category-${suffix}`,
            params: {
                query: req.query.category,
            }
        };
    }
    else {
        return {
            id: `wildcard-${suffix}`,
            params: {
                query: req.query.query,
            }
        };
    }
}

module.exports = { getFilters };