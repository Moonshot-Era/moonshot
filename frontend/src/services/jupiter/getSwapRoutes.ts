import { MOONSHOT_FEE, REF_FEE } from '@/utils';
import axios from 'axios';

export const getSwapRoutes = async (
  inputMint: string,
  outputMint: string,
  amount: string,
  slippageBps: string,
) => {
  try {
    const feeAmount = (+amount as number) * (REF_FEE + MOONSHOT_FEE);

    const quoteResponse = await axios.get(
      `${process.env.JUPITER_URL}v6/quote`,
      {
        params: {
          inputMint:
            inputMint === 'So11111111111111111111111111111111111111111'
              ? 'So11111111111111111111111111111111111111112'
              : inputMint,
          outputMint,
          amount: +amount - feeAmount,
          wrapAndUnwrapSol: true,
          asLegacyTransaction: true,
          prioritizationFeeLamports: 'auto',
          dynamicComputeUnitLimit: true,
          autoSlippage: true,
          slippageBps: 300,
          computeAutoSlippage: true,
          onlyDirectRoutes: false,
          swapMode: 'ExactIn',
          maxAccounts: 64,
          minimizeSlippage: false,
          experimentalDexes: 'Jupiter LO'
        }
      }
    );

    return quoteResponse
  } catch (err) {
    throw err;
  }
}
