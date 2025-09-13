export interface Order {
    id: number
    buyerEmail: string
    shippingAddress: ShippingAddress
    orderDate: string
    orderItems: OrderItem[]
    discount: number
    total: number
    orderStatus: string
}

export interface ShippingAddress {
    name: string
    line1: string
    line2?: string | null
    city: string
    state: string
    postal_code: string
    country: string
}

export interface OrderItem {
    productId: number
    name: string
    pictureUrl: string
    price: number
    quantity: number
}

export interface CreateOrder {
    shippingAddress: ShippingAddress
}