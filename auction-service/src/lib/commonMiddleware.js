import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';

export default handler => middy(handler)
  .use([
    // parse stringified event body.
    httpJsonBodyParser(),

    // adjust API Gateway event objects to prevent us from
    // having non-existent objects when trying to access non-existent 
    // path parameters and query parameters.
    httpEventNormalizer(),

    // simplifies error-handling process.
    httpErrorHandler()
  ]);