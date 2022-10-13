import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateProductRequest } from '../../requests/CreateProductRequest'
import { getUserId } from '../utils';
import { createProduct } from '../../businessLogic/Logic'
import { createLogger } from '../../utils/logger'
import { ExtendedProductItem } from '../../models/ProductItem'

const logger = createLogger('createProducts')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newProduct: CreateProductRequest = JSON.parse(event.body)
    const userid = getUserId( event )
    try 
    {
      const newItem : ExtendedProductItem = await createProduct(newProduct, userid)

      return {
        statusCode: 201,
        body: JSON.stringify({
          item: newItem
        })
      }
    } catch(e) {     
      logger.info("createProducts exception", { error: e.message } )
      return {
        statusCode: 400,
        body: JSON.stringify( { error: e.message } )
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
