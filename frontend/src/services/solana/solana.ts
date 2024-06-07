// @ts-nocheck

import { Connection, PublicKey } from '@solana/web3.js';
import { CubeSignerInstance } from '../cubist';

export const Solana = async () => {
  // If token is passed via env variable, decode and parse it,
  // otherwise just load token from default filesystem location.

  const connection = new Connection(
    process.env.SOLANA_RPC_PROVIDER,
    'confirmed'
  );
  const fromPubkey = new PublicKey(FROM_ADDRESS);
  const toPubkey = new PublicKey(TO_ADDRESS);

  // get airdrop
  try {
    await connection.requestAirdrop(fromPubkey, LAMPORTS_PER_SOL);
    await connection.confirmTransaction({});
    console.log('Got an airdrop!');
  } catch (e) {
    console.log(`Airdrop failed: ${e}. Ignoring.`);
  }

  // get balance
  console.log(
    `${fromPubkey} has ${
      (await connection.getBalance(fromPubkey)) / LAMPORTS_PER_SOL
    } SOL`
  );
  console.log(
    `${toPubkey} has ${
      (await connection.getBalance(toPubkey)) / LAMPORTS_PER_SOL
    } SOL`
  );

  console.log(
    `Transferring ${AMOUNT} SOL from ${fromPubkey} to ${toPubkey}...`
  );

  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports: AMOUNT * LAMPORTS_PER_SOL,
    })
  );
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  tx.feePayer = fromPubkey;
  const base64 = tx.serializeMessage().toString('base64');

  // sign using the well-typed solana end point (which requires a base64 serialized Message)
  const resp = await client.apiClient.signSolana(FROM_ADDRESS, {
    message_base64: base64,
  });
  const sig = resp.data().signature;
  // conver the signature 0x... to bytes
  const sigBytes = Buffer.from(sig.slice(2), 'hex');

  try {
    // Sign using the blob-signing end point. This requires the key to have
    // '"AllowRawBlobSigning"' policy (and thus the signing attempt could fail).
    const fromKeyId = `Key#Solana_${fromPubkey.toBase58()}`;
    const blobSig = (
      await client.apiClient.signBlob(fromKeyId, { message_base64: base64 })
    ).data().signature;

    // The signature should be the same
    assert(
      blobSig === sig,
      'Blob signature does not match the signature from solana-signing'
    );
  } catch (e) {
    console.log(`Failed to sign blob: ${e}. Ignoring.`);
  }

  // add signature to transaction
  tx.addSignature(fromPubkey, sigBytes);

  // send transaction
  const txHash = await connection.sendRawTransaction(tx.serialize());
  console.log(`txHash: ${txHash}`);

  // get balance
  console.log(
    `${fromPubkey} has ${
      (await connection.getBalance(fromPubkey)) / LAMPORTS_PER_SOL
    } SOL`
  );
  console.log(
    `${toPubkey} has ${
      (await connection.getBalance(toPubkey)) / LAMPORTS_PER_SOL
    } SOL`
  );
};
