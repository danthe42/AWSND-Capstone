import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createPresignedUrl } from '../../businessLogic/Logic'
import { getUserId } from '../utils'

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
      return {
        statusCode: 400,
         body: e
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
