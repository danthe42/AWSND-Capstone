import { apiEndpoint } from '../config'
import { Product, Review } from '../types/ProductModel';
import { CreateProductRequest, UpdateProductRequest, CreateReviewRequest } from '../types/CreateTodoRequest';
import Axios from 'axios'
import { UpdateTodoRequest } from '../types/UpdateTodoRequest';

export async function getProducts(idToken: string): Promise<Product[]> {
  console.log('Fetching todos')

  const response = await Axios.get(`${apiEndpoint}/products`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Products:', response.data)
  return response.data.items
}

export async function getProduct(idToken: string, ProductID : string): Promise<Product> {
  console.log('Fetching product info for ' + ProductID)

  const response = await Axios.get(`${apiEndpoint}/products/${ProductID}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Product info received:', response.data)
  return response.data.items[0]
}

export async function updateProduct(idToken: string, ProductID : string, updatedProduct: UpdateProductRequest): Promise<void> {
  console.log('Fetching product info for ' + ProductID)

  const response = await Axios.patch(`${apiEndpoint}/products/modify/${ProductID}`, JSON.stringify(updatedProduct), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getReviews(idToken: string, ProductID : string): Promise<Review[]> {
  console.log('Fetching reviews for ' + ProductID)

  const response = await Axios.get(`${apiEndpoint}/products/${ProductID}/review`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Reviews received:', response.data)
  return response.data.items
}

export async function createProduct(
  idToken: string,
  newProduct: CreateProductRequest
): Promise<Product> {
  const response = await Axios.post(`${apiEndpoint}/products`,  JSON.stringify(newProduct), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function createReview(
  idToken: string,
  productid: string,
  newReview: CreateReviewRequest
): Promise<Review> {
  const response = await Axios.post(`${apiEndpoint}/products/${productid}/review`,  JSON.stringify(newReview), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchTodo(
  idToken: string,
  todoId: string,
  updatedTodo: UpdateTodoRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/todos/${todoId}`, JSON.stringify(updatedTodo), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteTodo(
  idToken: string,
  productId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/products/modify/${productId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  ProductID: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/products/modify/${ProductID}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
