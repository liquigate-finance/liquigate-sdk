import axios from 'axios';
import { baseUrl } from './urls';

export const deleteLimitOrder = async (orderId: string) => {
  const { data } = await axios.delete(`${baseUrl}/order`, {
    data: { orderIds: [orderId] },
  });
};
