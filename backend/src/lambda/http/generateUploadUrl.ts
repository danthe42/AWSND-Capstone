import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createPresignedUrl } from '../../businessLogic/Logic'
import { getUserId } from '../utils'
import { createLogger } from '../utils/logger'

const logger = createLogger('GenerateUploadUrl')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const productId = event.pathParameters.ProductID
    const userId = getUserId( event )
    try
    {
      const url: string = await createPresignedUrl( productId, userId )

      return {
       statusCode: 200,
        body: JSON.stringify({
          uploadUrl: url
        })
      }
    } catch (e) {
      logger.info("generateUploadUrl exception", { error: e.message } )
      return {
        statusCode: 400,
        body: JSON.stringify( { error: e.message } )
       }
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
