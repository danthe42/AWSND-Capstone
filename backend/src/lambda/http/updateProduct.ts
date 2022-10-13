import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateProduct } from '../../businessLogic/Logic'
import { UpdateProductRequest } from '../../requests/UpdateProductRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
const logger = createLogger('UpdateProduct')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const pid : string = event.pathParameters.ProductID
    const updatedProduct: UpdateProductRequest = JSON.parse(event.body)
    const userid = getUserId( event )
    try 
    {
      await updateProduct( updatedProduct, userid, pid )
      return {
        statusCode: 200,
        body: ""
      }
    } catch(e) {
      logger.info("UpdateProduct exception", { error: e.message } )
      return {
        statusCode: 401,
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

