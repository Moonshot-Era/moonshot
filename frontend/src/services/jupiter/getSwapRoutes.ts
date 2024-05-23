import axios from 'axios';

export const getSwapRoutes = async (
  inputMint: string,
  outputMint: string,
  amount: string,
  slippageBps: string,
) => {
  try {
    const routesResponse = await axios.get('https://quote-api.jup.ag/v6/quote', {
      params: {
        inputMint,
        outputMint,
        amount,
        slippageBps,
      },
    });
    return routesResponse;
  } catch (err) {
    throw Error(`Can't get swap routes: ${err}`);
  }
}
