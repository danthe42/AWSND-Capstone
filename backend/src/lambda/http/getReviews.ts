import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getReviews } from '../../businessLogic/Logic'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils';

const logger = createLogger('getReviews')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let pid = event.pathParameters.ProductID
    const userid = getUserId( event )

    logger.info("getReviews call", { ProductID: pid } )
    const reviews = await getReviews(userid, pid)
    logger.info("getProducts retval", reviews )

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: reviews
      })
    }
  })

handler.use(
  cors({
    credentials: true
  })
)

