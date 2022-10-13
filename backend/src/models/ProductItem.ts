export interface ProductItem {
  PartitionKey: string
  ProductID: string
  UserID: string
  CreatedAt: string
  ImageUrl: string
  Title: string
  Description: string
}

export interface ExtendedProductItem {
  PartitionKey: string
  ProductID: string
  UserID: string
  CreatedAt: string
  ImageUrl: string
  Title: string
  Description: string
  UpdatePossible: boolean
}
