export type Product = {
    id: number
    name: string
    description: string
    pictureUrl: string
    type: string
    brand: string
    quantityInStock: number
    userId?: string
    creatorName?: string
    createdDate: string
    isSaved: boolean
    saveCount: number
}
