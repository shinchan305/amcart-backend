const AWS = require('aws-sdk');
const {
    DynamoDBClient,
    BatchWriteItemCommand
} = require("@aws-sdk/client-dynamodb");
const config = require('./config');
const fs = require('fs');
const attr = require('dynamodb-data-types').AttributeValue;

AWS.config.update(config.aws_remote_config);

const getProductById = function (req, res) {
    const client = new AWS.DynamoDB.DocumentClient();
    console.log(req.query.id);
    const params = {
        TableName: config.aws_table_name,
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ":id": parseInt(req.params.id),
        }
    };

    client.query(params, function (err, data) {

        if (err) {
            console.log(err)
            res.send({
                success: false,
                message: err
            });
        } else {
            const { Items } = data;
            if (Items && Items.length) {
                res.send({
                    success: true,
                    data: Items[0]
                });
            }
            else {
                res.status(404).send({
                    success: false,
                    data: { "message": "No data found!" }
                });
            }
        }
    });
}

const createTable = function (req, res) {
    const client = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
    var params = {
        TableName: config.aws_table_name,
        KeySchema: [
            { AttributeName: "id", KeyType: "HASH" },  //Partition key
            { AttributeName: "name", KeyType: "RANGE" }  //Sort key
        ],
        AttributeDefinitions: [
            { AttributeName: "id", AttributeType: "N" },
            { AttributeName: "name", AttributeType: "S" }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        }
    };

    client.createTable(params, function (tableErr, tableData) {
        console.log('inside create table')
        if (tableErr) {
            console.error("Error JSON:", JSON.stringify(tableErr, null, 2));
        } else {
            res.send({
                success: true,
                message: "Created table successfully!"
            })
        }
    });
}

const bulkInsert = async function (req, res) {
    let rawdata = fs.readFileSync('./data/products.json');
    console.log(rawdata);
    let json_data = JSON.parse(rawdata);
    let dynamoDBRecords = getDynamoDBRecords(json_data.products);
    let batches = [];
    while (dynamoDBRecords.length) {
        batches.push(dynamoDBRecords.splice(0, 25));
    }
    await callDynamoDBInsert(batches);
}

const callDynamoDBInsert = async function (batches) {
    const dbclient = new DynamoDBClient({ region: config.aws_remote_config.region });
    return Promise.all(
        batches.map(async (batch) => {
            let requestItems = {};
            requestItems[config.aws_table_name] = batch;
            const params = {
                RequestItems: requestItems
            };
            await dbclient.send(new BatchWriteItemCommand(params))
        })
    );
}

const getDynamoDBRecords = function (data) {
    let dynamoDBRecords = data.map(entity => {
        entity = attr.wrap(entity)  //Important - Else Insert Error
        let dynamoRecord = Object.assign({ PutRequest: { Item: entity } })
        dynamoDBRecord = attr.wrap(dynamoRecord)
        return dynamoRecord
    })
    return dynamoDBRecords;
}

const deleteTable = function(req, res) {
    const client = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
    client.deleteTable({
        TableName: config.aws_table_name
    }, function(err, data){
        if (err) {
            console.log(err);
        }
        else {
            res.send({
                success: true,
                message: "Table deleted successfully!"
            })
        }
    });
}

module.exports = {
    getProductById, createTable, bulkInsert, deleteTable
};