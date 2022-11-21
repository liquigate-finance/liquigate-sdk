import axios from 'axios';
import { RawLimitOrder, ViewLimitOrder } from '../models/LimitOrder';
import { baseUrl } from './urls';

export const createLimitOrder = async (order: RawLimitOrder, signature: string) => {
  const { data } = await axios.post<{ order: ViewLimitOrder }>(`${baseUrl}/order`, {
    order,
    signature,
  });
  return data.order;
};
