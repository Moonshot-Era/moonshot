export const getTransactionsHistory = async (walletAddress: string) => {
  try {
    if (!walletAddress) {
      throw Error(`User don't have a wallet`);
    }
    const url = `${process.env.HELIUS_XYZ_URL_API}v0/addresses/${walletAddress}/transactions?api-key=${process.env.HELIUS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (err) {
    throw err;
  }
};
