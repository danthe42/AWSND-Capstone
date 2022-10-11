import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateProductRequest } from '../../requests/CreateProductRequest'
import { getUserId } from '../utils';
import { createProduct } from '../../businessLogic/Logic'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newProduct: CreateProductRequest = JSON.parse(event.body)
    const userid = getUserId( event )
    try 
    {
      const newItem = await createProduct(newProduct, userid)

      return {
        statusCode: 201,
        body: JSON.stringify({
          item: newItem
        })
      }
    } catch(e) {     
      return {
        statusCode: 400,
        body: e
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
