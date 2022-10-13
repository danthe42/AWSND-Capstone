import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getProducts } from '../../businessLogic/Logic'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getProducts')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let pid = undefined
    if (event.pathParameters)
    {
      pid = event.pathParameters.ProductID
      logger.info("getProducts", { ProductID: pid } )
    }

    try 
    {
      const products = await getProducts(pid)
      logger.info("getProducts", products )

      return {
        statusCode: 200,
        body: JSON.stringify({
          items: products
        })
      }
    } catch (e) {
      logger.info("getProducts exception", { error: e.message } )
      return {
        statusCode: 400,
        body: JSON.stringify( { error: e.message } )
      }
    }
  })

handler.use(
  cors({
    credentials: true
  })
)

