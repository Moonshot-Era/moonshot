export const getTransactionHistory = async (walletAddress: string) => {
  try {
    if (!walletAddress) {
      throw Error(`User don't have a wallet`);
    }

    const url = `${process.env.HELIUS_XYZ_URL_API}v0/addresses/${walletAddress}/transactions?api-key=${process.env.HELIUS_API_KEY}`;
    console.log('url', url);

    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (err) {
    console.log('Error:' + err);
  }
  return {};
};
