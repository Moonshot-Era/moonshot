import {
  Connection,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import axios from 'axios';
import { CubeSignerInstance, getUserWallet } from '../cubeSigner';

export const swapTokens = async (oidcToken: string, swapRoutes: void) => {
  try {
    const walletAddress = await getUserWallet(oidcToken);
    
    console.log('walletAddress, swapRoutes', walletAddress, swapRoutes);

    const { data: swapTransaction } = await axios.post(`${process.env.JUPITER_URL}/v6/swap`, {
      // quoteResponse from /quote api
      quoteResponse: swapRoutes,
      // user public key to be used for the swap
      userPublicKey: walletAddress,
      // auto wrap and unwrap SOL. default is true
      wrapAndUnwrapSol: true,
      // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
      // feeAccount: "fee_account_public_key"
    });

    console.log('swapTransaction', swapTransaction);

    // 1 Sign transaction
    // 2 execute transaction

  } catch (err) {
    throw Error('Error during token swap: ' + err);
  }
};
