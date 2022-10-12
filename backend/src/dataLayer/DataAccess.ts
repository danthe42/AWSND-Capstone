import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { ProductItem } from '../models/ProductItem'
import { ReviewItem } from '../models/ReviewItem'
import { ProductUpdate } from '../models/ProductUpdate'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('DataAccess')

export class DataAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly productTable = process.env.PRODUCT_TABLE,
    private readonly productTableIndexname = process.env.PRODUCT_PRODUCTID_INDEX,
    private readonly reviewTable = process.env.REVIEW_TABLE,
    private readonly reviewTableIndexname = process.env.REVIEWS_CREATED_AT_INDEX,
    private readonly maximumProducts : number = parseInt( process.env.MAXIMUM_PRODUCT_COUNT )
    ) {
  }

  async deleteProductItem(  
    createdAt: string,
    _userId: string
  ) : Promise<void> {
    let pkey:string = "1"
    const productItem = {
      Key: {
        PartitionKey: pkey,
        CreatedAt: createdAt
    },
      TableName: this.productTable
    }
    await this.docClient.delete( productItem ).promise()
  }

  async createReviewItem(reviewItem: ReviewItem): Promise<ReviewItem> {
    logger.info("createReviewItem", reviewItem )
    await this.docClient.put({
      TableName: this.reviewTable,
      Item: reviewItem
    }).promise()

    return reviewItem
  }

  async createProductItem(productItem: ProductItem): Promise<ProductItem> {
    logger.info("createProductItem", productItem )
    await this.docClient.put({
      TableName: this.productTable,
      Item: productItem
    }).promise()

    return productItem
  }

  async updateTodoItem_imageurl(
      createdAt: string,
      url: string
    ): Promise<void> {
      let pkey:string = "1"
      await this.docClient.update({
        Key: {
          PartitionKey: pkey,
          CreatedAt: createdAt
          },
        UpdateExpression: 'SET ImageUrl=:url',          
        ExpressionAttributeValues: { 
          ':url': url
        },
        TableName: this.productTable
    }).promise() 
  }

  async updateProductItem (   
    createdAt: string,
    _UserId: string,
    productUpdate: ProductUpdate): Promise<void> {
    let pkey:string = "1"
    await this.docClient.update({
      Key: {
        PartitionKey: pkey,
        CreatedAt: createdAt
      },
      UpdateExpression: 'SET Title=:title, Description=:desc',          // Attribute "name" is a reserved keyword, so use #name workaround
      ExpressionAttributeValues: { 
        ':title': productUpdate.Title,
        ':desc': productUpdate.Description
      },
      TableName: this.productTable
    }).promise() 
  }

  async getAllProducts() : Promise<ProductItem[]> {
    logger.info("getAllProducts", { } )
    let pkey:string = "1"

    const result = await this.docClient.query({
      TableName: this.productTable,
      KeyConditionExpression: 'PartitionKey = :pkey',
      ExpressionAttributeValues: {
        ':pkey': pkey
      },
      Limit: this.maximumProducts,
      ScanIndexForward: false
    }).promise()

    logger.info("getAllProduct retval", result.Items )

    return result.Items as ProductItem[]
  }

  async getOneProduct(ProductID: string) : Promise<ProductItem[]> {
    logger.info("getOneProduct", { ProductID: ProductID } )

    const item = {
      TableName: this.productTable,
      IndexName: this.productTableIndexname,
      KeyConditionExpression: 'ProductID = :pid',
      ExpressionAttributeValues: {
        ':pid': ProductID
      }
    }
    logger.info("getOneProduct item", item )

    const result = await this.docClient.query(item).promise()
    logger.info("getOneProduct retval", { result } )

    if (!result || result.Count !== 1)
    {
      logger.info("getOneProduct: record not found !", { ProductID: ProductID } )
      throw Error("Product not found")
    }

    return result.Items as ProductItem[]
  }

  async getReviewsForProduct( UserID: string, ProductID: string ) : Promise<ReviewItem[]> {
    logger.info("getReviewsForProduct", { userid: UserID, productid: ProductID } )
    const result = await this.docClient.query({
      TableName: this.reviewTable,
      IndexName: this.reviewTableIndexname,
      KeyConditionExpression: 'ProductID = :ProductID',
      ExpressionAttributeValues: {
        ':ProductID': ProductID
      },
      ScanIndexForward: true
    }).promise()
    return result.Items as ReviewItem[]
  } 
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
