import * as uuid from 'uuid'
import { ProductItem } from '../models/ProductItem'
//import { TodoUpdate } from '../models/TodoUpdate'
import { DataAccess } from '../dataLayer/DataAccess'
import { CreateProductRequest } from '../requests/CreateProductRequest'
//import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
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

export async function updateTodo(
  updatedTodo: UpdateTodoRequest,
  userId: string,
  todoId: string
): Promise<void> {
  const todo = await todoAccess.getItem( todoId, userId )
  if (!todo)
    throw new Error("Todo record was not found, or the current user is not the owner of it")

  await todoAccess.updateTodoItem( todoId, userId, updatedTodo as TodoUpdate )
}
*/
export async function createProduct(
  createProductRequest: CreateProductRequest,
  userId: string
): Promise<ProductItem> {

  const itemId = uuid.v4()

  const newItem : ProductItem = await dataAccessor.createProductItem({
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

export async function getAllProducts() : Promise<ProductItem[]> {
  return await dataAccessor.getAllProducts()
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
