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