console.log('Loading function');

const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context, callback) {
  console.log('Received event:', JSON.stringify(event, null, 2));
  let params = {
      TableName: "twoFactorAuth",
      KeyConditionExpression: "message_type = :message_type",
      ExpressionAttributeValues: {
        ":message_type": 'SMS'
      },
      ScanIndexForward: "false",
      Limit: 1
  };
  dynamoDB.query(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      callback(err, 'Failed to retrieve SMS: ' + JSON.stringify({ message: 'FAIL', err: err.stack }))
    } else {
      console.log(JSON.stringify(data.Items[0], null, 2));
      callback(null, { "statusCode": 200, "body": JSON.stringify(data.Items[0])});

    }
  });
}

