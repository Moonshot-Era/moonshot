import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

import { CubeSignerInstance, getUserWallet } from '../cubeSigner';

export const sendTransaction = async (
  oidcToken: string,
  fromAddress: string,
  toAddress: string,
  amount: number
) => {
  try {
    const client = await CubeSignerInstance.getUserSessionClient(oidcToken);

    const connection = new Connection(
      process.env.SOLANA_RPC_PROVIDER,
      'confirmed'
    );

    // const fromAddress = await getUserWallet(oidcToken);
    // if (!fromAddress) {
    //   throw Error('Wallet not found');
    // }
    const fromPubkey = new PublicKey(fromAddress);
    const toPubkey = new PublicKey(toAddress);

    console.log(`Transferring ${amount} SOL from ${fromPubkey} to ${toPubkey}`);

    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.feePayer = fromPubkey;
    const base64 = tx.serializeMessage().toString('base64');

    // sign using the well-typed solana end point (which requires a base64 serialized Message)
    const resp = await client.apiClient.signSolana(fromAddress, {
      message_base64: base64,
    });
    const sig = resp.data().signature;
    // conver the signature 0x... to bytes
    const sigBytes = Buffer.from(sig.slice(2), 'hex');

    // add signature to transaction
    tx.addSignature(fromPubkey, sigBytes);

    // send transaction
    const txHash = await connection.sendRawTransaction(tx.serialize());
    console.log(`txHash: ${txHash}`);
  } catch (err) {
    throw Error('Error sending transaction: ' + err);
  }
};
