import axios from 'axios';

export const getSwapRoutes = async (
  inputMint: string,
  outputMint: string,
  amount: string,
  slippageBps: string,
) => {
  try {
    const quoteResponse = await axios.get(`${process.env.JUPITER_URL}/v6/quote`, {
      params: {
        inputMint: inputMint === 'So11111111111111111111111111111111111111111'
          ? 'So11111111111111111111111111111111111111112' : inputMint,
        outputMint,
        amount,
        wrapAndUnwrapSol: true,
        asLegacyTransaction: true,
        autoSlippage: true,
      },
    });

    return quoteResponse;
  } catch (err) {
    throw Error(`Can't get swap routes: ${err}`);
  }
}
