import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getProducts } from '../../businessLogic/Logic'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getTodos')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let pid = undefined
    if (event.pathParameters)
    {
      pid = event.pathParameters.ProductID
      logger.info("getProducts", { ProductID: pid } )
    }

    const products = await getProducts(pid)
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

