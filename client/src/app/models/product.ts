export type Product = {
    id: number
    name: string
    description: string
    pictureUrl: string
    type: string
    userId?: string
    creatorName?: string
    creatorCity?: string
    creatorMunicipality?: string
    creatorNeighborhood?: string
    createdDate: string
    isSaved: boolean
    saveCount: number
}
