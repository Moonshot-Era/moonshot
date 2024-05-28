/**
 * Converts a token amount to the correct integer value based on its decimals.
 * @param {number} amount - The token amount in its human-readable form (e.g., 1 USDC).
 * @param {number} decimals - The number of decimals the token has (e.g., 6 for USDC).
 * @returns {number} - The integer representation of the token amount.
 */
export function convertToInteger(amount: number, decimals: number): number {
  return amount * Math.pow(10, decimals);
}

/**
* Converts an integer token amount back to its human-readable form based on its decimals.
* @param {number} amountInt - The token amount in its integer form (e.g., 1000000 for 1 USDC).
* @param {number} decimals - The number of decimals the token has (e.g., 6 for USDC).
* @returns {number} - The human-readable representation of the token amount.
*/
export function convertToReadable(amountInt: number, decimals: number): number {
  return amountInt / Math.pow(10, decimals);
}
