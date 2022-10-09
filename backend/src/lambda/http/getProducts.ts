import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getAllProducts } from '../../businessLogic/Logic'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getTodos')

export const handler = middy(
  async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const products = await getAllProducts()
    logger.info("getProducts", products )

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: products
      })
    }
  })

handler.use(
  cors({
    credentials: true
  })
)

