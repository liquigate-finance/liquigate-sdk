import axios from 'axios';
import { baseUrl } from './urls';

export const getUserTokensBalances = async (userAddress: string, chainId: number) => {
  const { data } = await axios.get<{ balances: Array<{ token: string; balance: number }> }>(`${baseUrl}/balance/user`, {
    params: { userAddress, chainId },
  });
  return data.balances;
};
