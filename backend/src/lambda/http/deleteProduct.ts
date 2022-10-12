import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteProduct } from '../../businessLogic/Logic'
import { getUserId } from '../utils'
import { createLogger } from '../utils/logger'

const logger = createLogger('DeleteProducts')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const productid = event.pathParameters.ProductID
    const userid = getUserId( event )
    try {
      await deleteProduct(productid, userid)
      return {
        statusCode: 200,
        body: ""
      }
    } catch (e) {
      logger.info("DeleteProducts exception", { error: e.message } )

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
