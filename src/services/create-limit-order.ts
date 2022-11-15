import axios from 'axios';
import { LimitOrder } from '../models';
import { ViewLimitOrder } from '../models/LimitOrder';
import { baseUrl } from './urls';

export const createLimitOrder = async (order: LimitOrder, signature: string) => {
  const { data } = await axios.post<{ order: ViewLimitOrder }>(`${baseUrl}/order`, {
    order,
    signature,
  });
  return data.order;
};
