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
    private readonly reviewTable = process.env.REVIEW_TABLE,
    private readonly reviewTableIndexname = process.env.REVIEWS_CREATED_AT_INDEX
    ) {
  }

/*  async deleteTodoItem(  
    todoId: string,
    userId: string
  ) : Promise<void> {
    const todoItem = {
      Key: {
        userId: userId,
        todoId: todoId   
      },
      TableName: this.todoTable
    }
    await this.docClient.delete( todoItem ).promise()
  }
*/
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
/*
  async updateTodoItem_attachment(
    todoId: string,
    userId: string,
    url: string
  ): Promise<void> {
    await this.docClient.update({
      Key: {
          todoId: todoId,
          userId: userId
      },
      UpdateExpression: 'SET attachmentUrl=:attachmentUrl',          
      ExpressionAttributeValues: { 
        ':attachmentUrl': url
      },
      TableName: this.todoTable
  }).promise() 
}
*/
  async updateProductItem (   
    ProductID: string,
    _UserId: string,
    productUpdate: ProductUpdate): Promise<void> {
    await this.docClient.update({
      Key: {
        ProductID: ProductID
      },
      UpdateExpression: 'SET Title=:title, Description=:desc',          // Attribute "name" is a reserved keyword, so use #name workaround
      ExpressionAttributeValues: { 
        ':title': productUpdate.Title,
        ':desc': productUpdate.Description
      },
      TableName: this.productTable
    }).promise() 
  }
/*
  async getItem( todoId : string, userId : string ) : Promise<TodoItem> {
    const todoItem = {
      Key: {
        userId: userId,
        todoId: todoId   
      },
      TableName: this.todoTable
    }

    const result = await this.docClient.get(todoItem).promise()
    return result.Item as TodoItem
  }
*/

  async getAllProducts() : Promise<ProductItem[]> {
    logger.info("getAllProducts", { } )
    const result = await this.docClient.scan({
      TableName: this.productTable
    }).promise()

    return result.Items as ProductItem[]
  }

  async getOneProduct(ProductID: string) : Promise<ProductItem[]> {
    logger.info("getOneProduct", { ProductID: ProductID } )
    const productItem = {
      Key: {
        ProductID: ProductID
      },
      TableName: this.productTable
    }

    const result = await this.docClient.get(productItem).promise()
    if (!result || !result.Item)
      return [ ] as ProductItem[]
    else 
      return [ result.Item ] as ProductItem[]
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
