export function currencyFormat(amount: number): string {
    return '$' + (amount / 100).toFixed(2)
}