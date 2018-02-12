const AWS = require('aws-sdk');
const Promise = require('bluebird');
const path = require('path');

AWS.config.loadFromPath(path.resolve(__dirname, './config.json'));
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});


sqs.getQueueUrlAsync = Promise.promisify(sqs.getQueueUrl);
sqs.sendMessageAsync = Promise.promisify(sqs.sendMessage);
sqs.sendMessageBatchAsync = Promise.promisify(sqs.sendMessageBatch);


var EventLog = function(service) {
  
  if (!service) {
    throw new Error('Sending service should be provided as argument');
  }

  this.handlers = {};
  this.queueUrl = 'https://sqs.us-east-2.amazonaws.com/655101539314/events';
  this.service = service;

};

EventLog.prototype.send = function(type, payload) {
  if (this.queueUrl) {

    let messageAttributes = {};

    // set service name identifier
    messageAttributes.service = {
      DataType: 'String',
      StringValue: this.service
    };

    // set message type identifier
    messageAttributes.type = {
      DataType: 'String',
      StringValue: type
    };
    
    // convert payload to SQS format
    for (let key in payload) {
      messageAttributes[key] = messageAttributes[key] || {};
      
      switch (typeof payload[key]) {

      case 'number':
        messageAttributes[key].DataType = 'String';
        messageAttributes[key].StringValue = payload[key].toString();
        break;

      case 'string':
      default:
        messageAttributes[key].DataType = 'String';
        messageAttributes[key].StringValue = payload[key];
        break;
      }
    }
    
    // bundle up message params
    let params = {
      MessageBody: type, 
      QueueUrl: this.queueUrl, 
      MessageAttributes: messageAttributes
    };

    return sqs.sendMessageAsync(params)

      .catch((err) => {
        console.log(err);
      });

  } else {
    throw new Error('No connection to Event Log');
  }
};

module.exports = EventLog; 