export interface Product {
  ProductID: string
  UserID: string
  CreatedAt: string
  ImageUrl: string
  Title: string
  Description: string
}

export interface Review {
  ProductID: string
  ReviewID: string
  UserID: string
  CreatedAt: string
  Text: string
}
