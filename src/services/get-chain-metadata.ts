import axios from 'axios';
import { ChainMetadata } from '../models/ChainMetadata';
import { baseUrl } from './urls';

export const getChainMetadata = async (chainId: number) => {
  const { data } = await axios.get<{ config: ChainMetadata }>(`${baseUrl}/chain_config/metadata`, {
    params: { chainId },
  });
  return new ChainMetadata(data.config);
};
