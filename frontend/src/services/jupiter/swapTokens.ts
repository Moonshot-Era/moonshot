import {
  Connection,
  PublicKey,
  Transaction,
  VersionedTransaction,
} from '@solana/web3.js';
import axios from 'axios';
import { CubeSignerInstance, getUserWallet } from '../cubeSigner';

export const swapTokens = async (oidcToken: string, swapRoutes: void) => {
  try {
    const client = await CubeSignerInstance.getUserSessionClient(oidcToken);
    const walletAddress = await getUserWallet(oidcToken);

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

    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

    const resp = await client.apiClient.signSolana(fromAddress, {
      message_base64: base64,
    });
    const sig = resp.data().signature;
    // conver the signature 0x... to bytes
    const sigBytes = Buffer.from(sig.slice(2), 'hex');


  } catch (err) {
    throw Error('Error during token swap: ' + err);
  }
};
