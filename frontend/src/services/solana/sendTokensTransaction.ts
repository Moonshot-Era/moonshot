import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Signer,
} from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
  getMint,
} from '@solana/spl-token';

const sendTokensTransaction = async (
  fromWallet: string,
  toWallet: string,
  tokenAddress: string
) => {
  // Connect to cluster
  const connection = new Connection(
    process.env.SOLANA_RPC_PROVIDER,
    'confirmed'
  );

  // Generate a new wallet keypair and airdrop SOL
  // const fromWallet = Keypair.generate();

  // Generate a new wallet to receive newly minted token
  // const toWallet = Keypair.generate();

  const fromPubkey = new PublicKey(fromWallet);
  const toPubkey = new PublicKey(toWallet);

  const tokenPubkey = new PublicKey(tokenAddress);

  // Create new token mint
  const mintInfo = await getMint(connection, tokenPubkey);

  console.log(mintInfo.supply);

  // Get the token account of the fromWallet address, and if it does not exist, create it
  // const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
  //   connection,
  //   fromPubkey,
  //   mint,
  //   fromPubkey
  // );

  // // Get the token account of the toWallet address, and if it does not exist, create it
  // const toTokenAccount = await getOrCreateAssociatedTokenAccount(
  //   connection,
  //   fromWallet,
  //   mint,
  //   toWallet.publicKey
  // );

  // // Mint 1 new token to the "fromTokenAccount" account we just created
  // let signature = await mintTo(
  //   connection,
  //   fromWallet,
  //   mint,
  //   fromTokenAccount.address,
  //   fromWallet.publicKey,
  //   1000000000
  // );
  // console.log('mint tx:', signature);

  // // Transfer the new token to the "toTokenAccount" we just created
  // const tx = new Transaction().add(
  //   SystemProgram.transfer({
  //     fromPubkey,
  //     toPubkey,
  //     lamports: amount * LAMPORTS_PER_SOL,
  //   })
  // );

  // tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  // tx.feePayer = fromPubkey;
  // const base64 = tx.serializeMessage().toString('base64');

  // // sign using the well-typed solana end point (which requires a base64 serialized Message)
  // const resp = await client.apiClient.signSolana(fromAddress, {
  //   message_base64: base64,
  // });
  // const sig = resp.data().signature;
  // // conver the signature 0x... to bytes
  // const sigBytes = Buffer.from(sig.slice(2), 'hex');

  // // Sign using the blob-signing end point. This requires the key to have
  // // '"AllowRawBlobSigning"' policy (and thus the signing attempt could fail).
  // const fromKeyId = `Key#Solana_${fromPubkey.toBase58()}`;
  // const blobSig = (
  //   await client.apiClient.signBlob(fromKeyId, { message_base64: base64 })
  // ).data().signature;

  // // The signature should be the same
  // if (blobSig !== sig) {
  //   throw Error(
  //     'Blob signature does not match the signature from solana-signing. Failed to sign'
  //   );
  // }

  // // add signature to transaction
  // tx.addSignature(fromPubkey, sigBytes);

  // // send transaction
  // const txHash = await connection.sendRawTransaction(tx.serialize());
  // console.log(`txHash: ${txHash}`);
};
