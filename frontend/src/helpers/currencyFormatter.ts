
export const currencyFormatter = (number: number, options: void) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', ...options }).format(
    number,
  )
}