import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import axios from 'axios';
import { getUserSessionClient, getUserWallet } from '../cubeSigner';
import { authenticator } from 'otplib';
import { getMfaSecret } from '../helpers/getMfaSecret';
import { createNativeTxInstruction } from '../solana/createNativeTxInstruction';
import { FeeDataType } from '@/components/ConvertDrawer/types';
import {
  MOONSHOT_FEE,
  MOONSHOT_WALLET_ADDRESS,
  REF_FEE,
  REF_WALLET_ADDRESS
} from '@/utils';
import { isSolanaAddress } from '@/helpers/helpers';
import { createTokensTxInstruction } from '../solana/createTokensTxInstruction';

const sleep = async (ms: number) => {
  return new Promise((r) => setTimeout(r, ms));
};

export const swapTokens = async (swapRoutes: any, feeData: FeeDataType) => {
  try {
    console.log('Initializing client session...');
    const totpSecret = await getMfaSecret();

    const userSessionClient = await getUserSessionClient();

    if (userSessionClient) {
      const walletAddress = await getUserWallet(userSessionClient);
      const connection = new Connection(
        process.env.SOLANA_RPC_PROVIDER,
        'confirmed'
      );
      const fromPublicKey = new PublicKey(walletAddress!);

      console.log('Fetching latest blockhash...');
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      console.log('Requesting swap transaction...');
      const {
        data: { swapTransaction }
      } = await axios.post(`${process.env.JUPITER_URL}v6/swap`, {
        quoteResponse: swapRoutes,
        userPublicKey: fromPublicKey,
        wrapAndUnwrapSol: true,
        asLegacyTransaction: true
      });

      console.log('swapTransaction', swapTransaction);

      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      const transaction = Transaction.from(swapTransactionBuf);

      if (isSolanaAddress(feeData?.tokenAddress)) {
        createNativeTxInstruction({
          fromPublicKey,
          toAddress: MOONSHOT_WALLET_ADDRESS,
          amount: feeData.amount * MOONSHOT_FEE,
          tx: transaction
        });
        if (REF_WALLET_ADDRESS) {
          createNativeTxInstruction({
            fromPublicKey,
            toAddress: REF_WALLET_ADDRESS,
            amount: feeData.amount * REF_FEE,
            tx: transaction
          });
        }
      } else {
        await createTokensTxInstruction({
          fromPublicKey,
          toAddress: MOONSHOT_WALLET_ADDRESS,
          tokenAddress: feeData.tokenAddress,
          amount: feeData.amount * MOONSHOT_FEE,
          tokenDecimals: feeData.tokenDecimals,
          tokenSymbol: feeData.tokenSymbol,
          tx: transaction,
          connection
        });

        if (REF_WALLET_ADDRESS) {
          await createTokensTxInstruction({
            fromPublicKey,
            toAddress: REF_WALLET_ADDRESS,
            tokenAddress: feeData.tokenAddress,
            amount: feeData.amount * REF_FEE,
            tokenDecimals: feeData.tokenDecimals,
            tokenSymbol: feeData.tokenSymbol,
            tx: transaction,
            connection
          });
        }
      }

      const resp = await userSessionClient.apiClient.signSolana(
        walletAddress!,
        {
          message_base64: transaction.serializeMessage().toString('base64')
        }
      );

      let sig;
      if (totpSecret) {
        sig = await resp.totpApprove(
          userSessionClient,
          authenticator.generate(totpSecret)
        );
      }

      const sigBytes = Buffer.from(
        (sig || resp).data().signature.slice(2),
        'hex'
      );

      transaction.addSignature(fromPublicKey, sigBytes);

      const rawTransaction = Buffer.from(transaction.serialize());

      console.log('Sending raw transaction...', rawTransaction);
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: false,
        maxRetries: 50
      });

      console.log(`Transaction sent. Txid: ${txid}`);

      console.log('Confirming transaction...', blockhash, lastValidBlockHeight);
      const confirmation = await connection.confirmTransaction(
        {
          signature: txid,
          blockhash,
          lastValidBlockHeight
        },
        'confirmed'
      );

      console.log(`Transaction confirmed: ${confirmation}`);
      console.log(`https://solscan.io/tx/${txid}`);

      return txid;
    }
  } catch (err) {
    throw err;
  }
};
