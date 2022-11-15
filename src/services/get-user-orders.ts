import axios from 'axios';
import { ViewLimitOrder } from '../models/LimitOrder';
import { baseUrl } from './urls';

export const getLimitOrders = async (userAddress: string, chainId: number, type: 'active' | 'history') => {
  const { data } = await axios.get(`${baseUrl}/order/${type}`, {
    params: { userAddress, chainId },
  });
  return data.orders.map((order: any) => new ViewLimitOrder(order));
};
