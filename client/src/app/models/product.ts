export type Product = {
    id: number
    name: string
    description: string
    pictureUrl: string
    type: string
    quantityInStock: number
    userId?: string
    creatorName?: string
    creatorCity?: string
    createdDate: string
    isSaved: boolean
    saveCount: number
}
