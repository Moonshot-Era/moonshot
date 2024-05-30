import {
  Connection,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import axios from 'axios';
import { CubeSignerInstance, getUserWallet } from '../cubeSigner';

const sleep = async (ms: number) => {
  return new Promise(r => setTimeout(r, ms));
};

export const swapTokens = async (oidcToken: string, swapRoutes: any) => {
  try {
    console.log("Initializing client session...");
    const client = await CubeSignerInstance.getUserSessionClient(oidcToken);
    const walletAddress = await getUserWallet(oidcToken);
    const connection = new Connection(process.env.SOLANA_RPC_PROVIDER, 'confirmed');
    const publicKey = new PublicKey(walletAddress!);

    console.log("Fetching latest blockhash...");
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    console.log('Requesting swap transaction...');
    const {
      data: { swapTransaction }
    } = await axios.post(`${process.env.JUPITER_URL}v6/swap`, {
      quoteResponse: swapRoutes,
      userPublicKey: publicKey,
      wrapAndUnwrapSol: true,
      asLegacyTransaction: true
    });

    console.log('swapTransaction', swapTransaction);

    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
    const transaction = Transaction.from(swapTransactionBuf);

    const resp = await client.apiClient.signSolana(walletAddress!, {
      message_base64: transaction.serializeMessage().toString('base64'),
    });
    const sig = resp.data().signature;
    const sigBytes = Buffer.from(sig.slice(2), 'hex');

    transaction.addSignature(publicKey, sigBytes);

    const rawTransaction = Buffer.from(transaction.serialize());

    console.log("Sending raw transaction...", rawTransaction);
    const txid = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: false,
      maxRetries: 50,
    });

    console.log(`Transaction sent. Txid: ${txid}`);
    // Wait for a short time before confirming the transaction
    // await sleep(5000);

    console.log("Confirming transaction...", blockhash, lastValidBlockHeight);
    const confirmation = await connection.confirmTransaction({
      signature: txid,
      blockhash,
      lastValidBlockHeight
    }, 'confirmed');

    console.log(`Transaction confirmed: ${confirmation}`);
    console.log(`https://solscan.io/tx/${txid}`);

    return txid;
  } catch (err) {
    console.error('Error during token swap:', err);
    throw new Error('Error during token swap: ' + err);
  }
};
