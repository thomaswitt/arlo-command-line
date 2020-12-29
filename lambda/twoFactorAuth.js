'use strict'

console.log('Loading function');

const AWS = require('aws-sdk');

const saveToDB = async function (msg) {
  var timeStamp = new Date().toISOString().slice(0, 19).replace(/[A-Z:-]/g,'');
  var expiresAt = Math.round(Date.now() / 1000 + 60*15); // expire in 15 minutes
  var record = {
    TableName: 'twoFactorAuth',
    Item: {
      'message_type'    : {S: 'SMS'},
      'message_timestamp'    : {N: timeStamp},
      'message_body' : {S: msg.messageBody},
      'message_origination_number' : {S: msg.originationNumber},
      'message_destination_number' : {S: msg.destinationNumber},
      'message_keyword' : {S: msg.messageKeyword},
      'message_inbound_message_id' : {S: msg.inboundMessageId},
      'message_previous_published_message_id' : {S: msg.previousPublishedMessageId},
      'record_expires_at' : {N: expiresAt.toString()},
    }
  };
  console.log('saveToDB record: ', record)
  const dynamoDB = new AWS.DynamoDB();
  return new Promise((resolve, reject) => {
    dynamoDB.putItem(record, function(err, data) {
      if(err) {
        console.error(err)
        reject(err)
      } else {
        console.log("Record saved. Data: ", data)
        resolve(data)
      }
    })
  })
}

const smsResponder = async (event) => {
  const msg = JSON.parse(event.Sns.Message);
  const body = msg.messageBody;
  console.log("Message: " + body);
  console.log("Message Obj: " + JSON.stringify(msg, null, 2));
  return console.log(await saveToDB(msg))
}

exports.handler = async (event, context) => {
  console.log('Starting handler');
  await Promise.all(
    event.Records.map(async (record) => {
      try {
        await smsResponder(record);
      } catch (err) {
        console.error(err);
        return err;
      }
    })
  )
  return  { 'statusCode': 200 }
}

