import * as uuid from 'uuid'
import { ProductItem, ExtendedProductItem } from '../models/ProductItem'
import { ReviewItem } from '../models/ReviewItem'
import { ProductUpdate } from '../models/ProductUpdate'
import { DataAccess } from '../dataLayer/DataAccess'
import { CreateProductRequest } from '../requests/CreateProductRequest'
import { CreateReviewRequest } from '../requests/CreateReviewRequest'
import { UpdateProductRequest } from '../requests/UpdateProductRequest'
import { getUploadUrl, getReadUrl } from '../dataLayer/FileStoreAccess'
import { createLogger } from '../utils/logger'

const logger = createLogger('businesslogic')
const dataAccessor = new DataAccess()

export async function deleteProduct(
  productId: string,
  userId: string
) : Promise<void> {
  const product = await dataAccessor.getOneProduct( productId )
  if (!product || product.length==0)
    throw new Error("Product record was not found")
  if (product[0].UserID != userId)
    throw new Error("Product record to update is not owned by us !")

  await dataAccessor.deleteProductItem( product[0].CreatedAt, userId )
} 

export async function updateProduct(
  updatedProduct: UpdateProductRequest,
  userId: string,
  productId: string
): Promise<void> {
  const product = await dataAccessor.getOneProduct( productId )
  logger.info("1", product )
  if (!product || product.length==0)
    throw new Error("Product record was not found")
  logger.info("2", product )
  if (product[0].UserID != userId)
    throw new Error("Product record to update is not owned by us !")
  logger.info("3", product )

  await dataAccessor.updateProductItem( product[0].CreatedAt, userId, updatedProduct as ProductUpdate )
}

export async function createProduct(
  createProductRequest: CreateProductRequest,
  userId: string
): Promise<ExtendedProductItem> {

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

  let b : boolean = ( newItem.UserID == userId )
  let rv : ExtendedProductItem = { 
    UpdatePossible: b,
    ...newItem
  }

  logger.info("Created new product", rv )
  return rv
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

export async function getProducts(userid : string, ProductID? : string ) : Promise<ExtendedProductItem[]> {
  let rawProducts : ProductItem[] = undefined 

  if (ProductID)
  {
    rawProducts = await dataAccessor.getOneProduct(ProductID)                    // DB Get
  }
  else
  {
    rawProducts = await dataAccessor.getAllProducts()                             // DB Query
  }

  let rv : ExtendedProductItem[] = rawProducts.map( (val, _index) => {
    let b : boolean = ( val.UserID == userid )
    return { 
      UpdatePossible: b,
      ...val
    }
  })
  logger.info("getProducts final return from busineddlogic", rv )
  return rv
}

export async function getReviews( UserID: string, ProductID : string ) : Promise<ReviewItem[]> {
  return await dataAccessor.getReviewsForProduct(UserID, ProductID)                
}

export async function createPresignedUrl ( 
  productId: string, 
  userId: string 
) : Promise<string> {

  const prod = await dataAccessor.getOneProduct( productId )
  if (!prod || prod.length<1 || prod[0].UserID !== userId)
    throw new Error("Product record was not found, or the current user is not the owner of it")

  const url : string = getUploadUrl( productId )
  const readUrl : string = getReadUrl( productId )
  logger.info("createPresignedUrl", { presignedUrl: url, readUrl: readUrl } )

  await dataAccessor.updateTodoItem_imageurl( prod[0].CreatedAt, readUrl )

  return url
}
