const AWS = require('aws-sdk');
const config = require('./config');

AWS.config.update(config.aws_remote_config);
const s3 = new AWS.S3();

async function getImage(id) {
    const data = s3
        .getObject({
            Bucket: "amcart-images",
            Key: `home/image${id}.jpg`,
        })
        .promise();
    return data;
}

function encode(data) {
    let buf = Buffer.from(data);
    let base64 = buf.toString("base64");
    return base64;
}

const getHomeImages = async function (req, res) {
    let img = await getImage(req.params.id);
    let image = "data:image/jpeg;base64," + encode(img.Body);
    res.send({
        success: true,
        data: image
    });
}

module.exports = {
    getHomeImages
}