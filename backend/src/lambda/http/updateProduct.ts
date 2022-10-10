import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateProduct } from '../../businessLogic/Logic'
import { UpdateProductRequest } from '../../requests/UpdateProductRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const pid : string = event.pathParameters.ProductID
    const updatedProduct: UpdateProductRequest = JSON.parse(event.body)
    const userid = getUserId( event )
    await updateProduct( updatedProduct, userid, pid )
    return {
      statusCode: 200,
      body: ""
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

