import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction
} from '@solana/web3.js';

interface Props {
  fromPublicKey: PublicKey;
  toAddress: string;
  amount: number;
  tx: Transaction;
}

export const createNativeTxInstruction = ({
  fromPublicKey,
  toAddress,
  amount,
  tx
}: Props) => {
  const toPubkey = new PublicKey(toAddress);

  console.log(
    `Transferring ${amount} SOL from ${fromPublicKey} to ${toPubkey}`
  );

  tx.add(
    SystemProgram.transfer({
      fromPubkey: fromPublicKey,
      toPubkey,
      lamports: amount * LAMPORTS_PER_SOL
    })
  );
};
