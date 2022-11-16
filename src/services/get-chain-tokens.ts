import axios from 'axios';
import { TokenConfig } from '../models/TokenConfig';
import { baseUrl } from './urls';

export const getChainTokens = async (chainId: number) => {
  const { data } = await axios.get<{ tokens: TokenConfig[] }>(`${baseUrl}/chain_config/tokens`, {
    params: { chainId },
  });
  return data.tokens.map((token) => new TokenConfig(token));
};
