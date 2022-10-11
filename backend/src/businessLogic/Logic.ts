import * as uuid from 'uuid'
import { ProductItem } from '../models/ProductItem'
import { ReviewItem } from '../models/ReviewItem'
import { ProductUpdate } from '../models/ProductUpdate'
import { DataAccess } from '../dataLayer/DataAccess'
import { CreateProductRequest } from '../requests/CreateProductRequest'
import { CreateReviewRequest } from '../requests/CreateReviewRequest'
import { UpdateProductRequest } from '../requests/UpdateProductRequest'
//import { getUploadUrl, getReadUrl } from '../helpers/attachmentUtils'
import { createLogger } from '../utils/logger'

const logger = createLogger('businesslogic')
const dataAccessor = new DataAccess()

/*
export async function deleteTodo(
  todoId: string,
  userId: string
) : Promise<void> {

  const todo = await todoAccess.getItem( todoId, userId )
  if (!todo)
    throw new Error("Todo record was not found, or the current user is not the owner of it")

  await todoAccess.deleteTodoItem( todoId, userId )
} 
*/

export async function updateProduct(
  updatedProduct: UpdateProductRequest,
  userId: string,
  productId: string
): Promise<void> {
  const product = await dataAccessor.getOneProduct( productId )
  if (!product || product.length==0)
    throw new Error("Product record was not found")
  if (product[0].UserID != userId)
    throw new Error("Product record to update is not owned by us !")

  await dataAccessor.updateProductItem( product[0].CreatedAt, userId, updatedProduct as ProductUpdate )
}

export async function createProduct(
  createProductRequest: CreateProductRequest,
  userId: string
): Promise<ProductItem> {

  const itemId = uuid.v4()

  const newItem : ProductItem = await dataAccessor.createProductItem({
    PartitionKey: "1",
    ProductID: itemId,
    UserID: userId,
    CreatedAt: new Date().toISOString(),
    ImageUrl: "",
    Description: "",
    ...createProductRequest
  }) as ProductItem

  logger.info("Created new product", newItem )
  return newItem
}

export async function createReview(
  createReviewRequest: CreateReviewRequest,
  userId: string,
  productId: string
): Promise<ReviewItem> {

  const itemId = uuid.v4()

  const newItem : ReviewItem = await dataAccessor.createReviewItem({
    ProductID: productId,
    ReviewID: itemId,
    UserID: userId,
    CreatedAt: new Date().toISOString(),
    ...createReviewRequest
  }) as ReviewItem

  logger.info("Created new review record", newItem )
  return newItem
}

export async function getProducts(ProductID? : string ) : Promise<ProductItem[]> {
  if (ProductID)
  {
    return await dataAccessor.getOneProduct(ProductID)        // DB Get
  }
  else
  {
    return await dataAccessor.getAllProducts()                // DB Scan
  }
}

export async function getReviews( UserID: string, ProductID : string ) : Promise<ReviewItem[]> {
  return await dataAccessor.getReviewsForProduct(UserID, ProductID)                
}

/*

export async function createAttachmentPresignedUrl ( 
  todoId: string, 
  userId: string 
) : Promise<string> {

  const todo = await todoAccess.getItem( todoId, userId )
  if (!todo)
    throw new Error("Todo record was not found, or the current user is not the owner of it")

  const url : string = getUploadUrl( todoId )
  const readUrl : string = getReadUrl( todoId )
  logger.info("createAttachmentPresignedUrl", { presignedUrl: url, readUrl: readUrl } )

  await todoAccess.updateTodoItem_attachment( todoId, userId, readUrl )

  return url
}
*/
