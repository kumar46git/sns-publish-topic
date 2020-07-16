const core = require('@actions/core');
const AWS = require('aws-sdk');
const github = require('@actions/github');

async function execute() {
  try{
    const AWS_REGION = core.getInput("AWS_REGION") || process.env.AWS_REGION;
    const AWS_ACCESS_KEY_ID = core.getInput("AWS_ACCESS_KEY_ID") || process.env.AWS_ACCESS_KEY_ID;
    const AWS_SECRET_ACCESS_KEY = core.getInput("AWS_SECRET_ACCESS_KEY") || process.env.AWS_SECRET_ACCESS_KEY;
    
    const MESSAGE = core.getInput("MESSAGE");
    const TOPIC_ARN = core.getInput("TOPIC_ARN");

    AWS.config.update({
      region: AWS_REGION,
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY
    });
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    const params = {
      Message: payload,
      TopicArn: TOPIC_ARN
    };

    const publishTextPromise = new AWS.SNS({ apiVersion: "2010-03-31" })
    .publish(params)
    .promise();

    core.debug("Sending SMS");

    const { MessageId } = await publishTextPromise();

    core.debug("SMS sent!");

    return MessageId;
  }catch(error) {
    core.setFailed(error.message);
  }
}

execute();