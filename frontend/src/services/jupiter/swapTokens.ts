import {
  Connection,
  PublicKey,
  VersionedTransaction,
} from '@solana/web3.js';
import axios from 'axios';
import { CubeSignerInstance, getUserWallet } from '../cubeSigner';

const sleep = async (ms: number) => {
  return new Promise(r => setTimeout(r, ms));
};

export const swapTokens = async (oidcToken: string, swapRoutes: any) => {
  try {
    const client = await CubeSignerInstance.getUserSessionClient(oidcToken);
    const walletAddress = await getUserWallet(oidcToken);
    const connection = new Connection(process.env.SOLANA_RPC_PROVIDER, 'confirmed');
    const publicKey = new PublicKey(walletAddress!)

    const blockhashResponse = await connection.getLatestBlockhashAndContext();
    const lastValidBlockHeight = blockhashResponse.context.slot + 150;  

    const { data: { swapTransaction } } = await axios.post(`${process.env.JUPITER_URL}/v6/swap`, {
      // quoteResponse from /quote api
      quoteResponse: swapRoutes,
      // user public key to be used for the swap
      userPublicKey: publicKey,
      // auto wrap and unwrap SOL. default is true
      wrapAndUnwrapSol: true,
      // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
      // feeAccount: "fee_account_public_key"
    });

    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

    const resp = await client.apiClient.signSolana(publicKey.toString(), {
      message_base64: swapTransaction,
    });
    const sig = resp.data().signature;
    // conver the signature 0x... to bytes
    const sigBytes = Buffer.from(sig.slice(2), 'hex');

    transaction.addSignature(publicKey, sigBytes);

    const rawTransaction = transaction.serialize()
    let blockheight = await connection.getBlockHeight();

    const txid = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: true,
    });

    console.log(blockheight, lastValidBlockHeight);

    await connection.confirmTransaction(txid);
    console.log(`https://solscan.io/tx/${txid}`);    
  } catch (err) {
    throw Error('Error during token swap: ' + err);
  }
};
