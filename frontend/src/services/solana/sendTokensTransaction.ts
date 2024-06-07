import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
} from '@solana/web3.js';

import { CubeSignerInstance } from '../cubeSigner';
import {
  createTransferCheckedInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount,
} from '@solana/spl-token';
import { CubeSignerClient } from '@cubist-labs/cubesigner-sdk';
import { authenticator } from 'otplib';

export const sendTokensTransaction = async (
  oidcToken: string,
  fromAddress: string,
  toAddress: string,
  amount: number,
  tokenAddress: string,
  tokenDecimals: number
) => {
  //TODO get from supabase
  let totpSecret: string = 'SBCXRKMQOSFA6QTRGGVQR4BDWVPNQN5Y';
  let userClient: CubeSignerClient | undefined = undefined;

  const cubeClient = await CubeSignerInstance.getManagementSessionClient();

  try {
    const userSessionResp = await CubeSignerClient.createOidcSession(
      cubeClient.env,
      cubeClient.orgId,
      oidcToken,
      ['sign:*', 'manage:*']
    );

    if (userSessionResp.requiresMfa()) {
      const tmpClient = await userSessionResp.mfaClient()!;
      if (tmpClient) {
        const totpResp = await userSessionResp.totpApprove(
          tmpClient,
          authenticator.generate(totpSecret)
        );
        userClient = await CubeSignerClient.create(totpResp.data());
      }
    } else {
      userClient = await CubeSignerClient.create(userSessionResp.data());
    }

    if (userClient) {
      try {
        const connection = new Connection(
          process.env.SOLANA_RPC_PROVIDER,
          'confirmed'
        );

        const fromPubkey = new PublicKey(fromAddress);
        const toPubkey = new PublicKey(toAddress);

        const mintPubkey = new PublicKey(tokenAddress);

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

        let tokenAccount;
        const tx = new Transaction();
        try {
          const res = await getAccount(connection, toTokenAccount);
          if (res) {
            tokenAccount = res;
          }
        } catch (err) {
          console.log(`Token account error: ${err}`);
        }

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
            amount *
              (10 ** +tokenDecimals / LAMPORTS_PER_SOL) *
              LAMPORTS_PER_SOL, // amount
            tokenDecimals // decimals
          )
        );

        tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        tx.feePayer = fromPubkey;
        const base64 = tx.serializeMessage().toString('base64');

        // sign using the well-typed solana end point (which requires a base64 serialized Message)
        let resp = await userClient.apiClient.signSolana(fromAddress, {
          message_base64: base64
        });
        const sig = await resp.totpApprove(
          userClient,
          authenticator.generate(totpSecret)
        );

        // conver the signature 0x... to bytes
        const sigBytes = Buffer.from(sig.data().signature.slice(2), 'hex');

        // add signature to transaction
        tx.addSignature(fromPubkey, sigBytes);

        // send transaction
        // @ts-ignore
        const txHash = await connection.sendRawTransaction(tx.serialize());
        console.log(`txHash: ${txHash}`);
        return txHash;
      } catch (err) {
        throw Error('Error sending transaction: ' + err);
      }
    }
  } catch (err) {
    throw Error('Error sending transaction: ' + err);
  }
};
