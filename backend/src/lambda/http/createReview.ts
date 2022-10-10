import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateReviewRequest } from '../../requests/CreateReviewRequest'
import { getUserId } from '../utils';
import { createReview } from '../../businessLogic/Logic'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newReview: CreateReviewRequest = JSON.parse(event.body)
    const userid = getUserId( event )
    const pid = event.pathParameters.ProductID
    const newItem = await createReview(newReview, userid, pid)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
