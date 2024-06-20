import axios from 'axios';

export const fetchWallet = () => {
  return axios.post<Wallet>(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/get-wallet`
  );
};
