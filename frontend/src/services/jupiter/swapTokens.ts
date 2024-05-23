import {
  Connection,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import axios from 'axios';
import { CubeSignerInstance, getUserWallet } from '../cubeSigner';

const AMOUNT = 1000000; // Adjust amount based on token decimals

export const swapTokens = async (oidcToken: string, inputMint: string, outputMint: string) => {
  try {
    const client = await CubeSignerInstance.getUserSessionClient(oidcToken);

    const connection = new Connection(
      process.env.SOLANA_RPC_PROVIDER,
      'confirmed'
    );

    const fromAddress = await getUserWallet(oidcToken);
    if (!fromAddress) {
      throw Error('Wallet not found');
    }
    const fromPubkey = new PublicKey(fromAddress);
    const inputMintPubkey = new PublicKey(inputMint);
    const outputMintPubkey = new PublicKey(outputMint);

    console.log(
      `Swapping tokens from ${inputMintPubkey} to ${outputMintPubkey}...`
    );

    // Fetch swap routes from Jupiter API
    const routesResponse = await axios.get('https://quote-api.jup.ag/v1/quote', {
      params: {
        inputMint: inputMintPubkey.toBase58(),
        outputMint: outputMintPubkey.toBase58(),
        amount: AMOUNT,
        slippage: 1, // Adjust based on desired slippage tolerance
      }
    });

    const routes = routesResponse.data.data;
    if (routes.length === 0) {
        throw Error('No swap routes found');
    }

    // Select the best route
    const bestRoute = routes[0];

    // Build the transaction
    const tx = new Transaction().add(...bestRoute.instructions.map((inst: any) => {
        return {
            keys: inst.keys.map((key: any) => ({ pubkey: new PublicKey(key.pubkey), isSigner: key.isSigner, isWritable: key.isWritable })),
            programId: new PublicKey(inst.programId),
            data: Buffer.from(inst.data, 'base64')
        };
    }));

    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.feePayer = fromPubkey;
    const base64 = tx.serializeMessage().toString('base64');

    // Sign using the well-typed solana end point (which requires a base64 serialized Message)
    const resp = await client.apiClient.signSolana(fromAddress, {
      message_base64: base64,
    });
    const sig = resp.data().signature;
    const sigBytes = Buffer.from(sig.slice(2), 'hex');

    // Sign using the blob-signing end point. This requires the key to have
    // '"AllowRawBlobSigning"' policy (and thus the signing attempt could fail).
    const fromKeyId = `Key#Solana_${fromPubkey.toBase58()}`;
    const blobSig = (
      await client.apiClient.signBlob(fromKeyId, { message_base64: base64 })
    ).data().signature;

    if (blobSig !== sig) {
      throw Error(
        'Blob signature does not match the signature from solana-signing. Failed to sign'
      );
    }

    // Add signature to transaction
    tx.addSignature(fromPubkey, sigBytes);

    // Send transaction
    const txHash = await connection.sendRawTransaction(tx.serialize());
    console.log(`txHash: ${txHash}`);

    // Get balances (optional)
    console.log(
      `${fromPubkey} has ${
        (await connection.getBalance(fromPubkey)) / LAMPORTS_PER_SOL
      } SOL`
    );
  } catch (err) {
    console.error('Error during token swap', err);
    throw Error('Error during token swap');
  }
};
