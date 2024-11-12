export interface APIResponse<T>{
  message: string,
  statusCode: number,
  success: boolean,
  data: T
}
export type Image = {
    _id: string,
    localPath: string,
    url: string
}
export type User = {
     __v : number,
     _id : string,
     avatar : Image,
     createdAt : string,
     email : string,
     isEmailVerified : boolean,
    //  loginType :  EMAIL_PASSWORD ,
     role :    "ADMIN"    |    "USER"   ,
     updatedAt : string,
     username : string
}

export type Category = {
      __v  : number,
      _id  :  string,
      createdAt  : string, 
      name  :  string,
      owner  :   string,
      updatedAt  :   string
}

type PaginationContent = {
    limit: number,
    page: number,
    totalPages: number,
    serialNumberStartFrom: number,
    hasNextPage: boolean,
    hasPrevPage: boolean,
    prevPage: null | number,
    nextPage: null | number,
}

export type Categories = PaginationContent & {
    totalCategories: number,
    categories: Category[]
}

export type Product = {
    _v: number,
    _id: string,
    category: string,
    createdAt: string,
    description: string,
    mainImage: Image,
    name: string,
    owner: string,
    price: number,
    stock: number,
    subImages: Image[],
    updatedAt: string
}

export type Products = PaginationContent & {
    totalProducts: number,
    Products: Product[]
}

export type Error = {
    errors?: Record<string, string[]>;
    statusCode: number;
    message: string;
    success: boolean,
}