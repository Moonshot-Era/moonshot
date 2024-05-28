import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

import { CubeSignerInstance, getUserWallet } from '../cubeSigner';
import {
  createTransferCheckedInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount,
} from '@solana/spl-token';

const tokenMint = {
  address: 'FwBixtdcmxawRFzBNeUmzhQzaFuvv6czs5wCQuLgWWsg',
  decimals: 6,
};

export const sendTokensTransaction = async (
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
    const tx = new Transaction();

    const fromPubkey = new PublicKey(fromAddress);
    const toPubkey = new PublicKey(toAddress);

    const mintPubkey = new PublicKey(tokenMint.address);

    console.log(`Transferring ${amount} from ${fromPubkey} to ${toPubkey}`);

    // Get the associated token accounts for the sender and receiver
    const fromTokenAccount = await getAssociatedTokenAddress(
      mintPubkey, // mint
      fromPubkey, // from owner
      true, // allow owner off curve
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const toTokenAccount = await getAssociatedTokenAddress(
      mintPubkey, // mint
      toPubkey, // to owner
      true, // allow owner off curve
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const tokenAccount = await getAccount(connection, toTokenAccount);

    if (!tokenAccount) {
      tx.add(
        createAssociatedTokenAccountInstruction(
          fromPubkey,
          toTokenAccount,
          toPubkey,
          mintPubkey,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      );
    }

    tx.add(
      createTransferCheckedInstruction(
        fromTokenAccount, // from
        mintPubkey, // mint
        toTokenAccount, // to
        fromPubkey, // from's owner
        amount * LAMPORTS_PER_SOL, // amount
        tokenMint?.decimals // decimals
      )
    );

    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.feePayer = fromPubkey;
    const base64 = tx.serializeMessage().toString('base64');

    // sign using the well-typed solana end point (which requires a base64 serialized Message)
    // @ts-ignore
    const resp = await client.apiClient.signSolana(fromAddress, {
      message_base64: base64,
    });
    const sig = resp.data().signature;
    // conver the signature 0x... to bytes
    const sigBytes = Buffer.from(sig.slice(2), 'hex');

    // add signature to transaction
    tx.addSignature(fromPubkey, sigBytes);

    // send transaction
    // @ts-ignore
    const txHash = await connection.sendRawTransaction(tx.serialize());
    console.log(`txHash: ${txHash}`);
    return txHash;
  } catch (err) {
    throw Error('Error sending transaction:' + err);
  }
};
