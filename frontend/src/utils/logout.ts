import axios from 'axios';

export const logout = async () => {
  await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/auth/logout`);
};
