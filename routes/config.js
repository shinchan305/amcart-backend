const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    aws_table_name: 'products',
    aws_remote_config: {
      accessKeyId: process.env.AWS_ACCESS_ID,
      secretAccessKey: process.env.AWS_ACCESS_KEY,
      region: process.env.AWS_REGION,
    },
    opensearch_config: {
      host: process.env.OPENSEARCH_HOST,
      auth: {
        username: process.env.OPENSEARCH_USER,
        password: process.env.OPENSEARCH_PASS
      }
    }
};