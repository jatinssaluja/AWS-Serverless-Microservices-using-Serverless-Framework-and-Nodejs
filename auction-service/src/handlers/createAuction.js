import {v4 as uuid} from 'uuid';
import AWS from 'aws-sdk';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

const dynamodb = AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {

  const {title} = event.body;
  const now = new Date();
 
  const auction = {
    id:uuid(),
    title,
    status:'open',
    createdAt: now.toISOString()

  }

  try{

    await dynamodb.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item:auction
    }).promise();

  } catch(error){

    console.error(error);
    throw new createError.InternalServerError(error);

  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = middy(createAuction)
  .use(httpJsonBodyParser()) // parse stringified event body.
  // adjust API Gateway event objects to prevent us from
  // having non-existent objects when trying to access non-existent 
  // path parameters and query parameters.
  .use(httpEventNormalizer()) 
  .use(httpErrorHandler()); // simplifies error-handling process.


