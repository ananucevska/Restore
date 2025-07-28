import {PaymentSummary, ShippingAddress} from "../app/models/order.ts";

export function currencyFormat(amount: number): string {
    return '$' + (amount / 100).toFixed(2)
}

export function filterEmptyValues(values: object) {
   return Object.fromEntries(
        Object.entries(values).filter(
            ([, value]) => value !== '' && value !== null
                && value !== undefined && value.length !== 0 //ako nekoja vrednost e prazna nema da se prakja u requestot u urlto
        )
    )
}

export const formatAddressString = (address: ShippingAddress) => {
    return `${address?.name}, ${address?.line1}, ${address?.city}, ${address?.state}, ${address?.postal_code}, ${address?.country}`;
}

export const formatPaymentString = (card: PaymentSummary) => {
    return `${card?.brand?.toUpperCase()}, **** **** **** ${card?.last4}, Exp: ${card?.exp_month}/${card?.exp_year}`; // ? za  da izbegneme greska deka komponentot se loadira pred da go pristapi brand
}