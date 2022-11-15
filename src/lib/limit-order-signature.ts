import { ethers } from 'ethers';
import LimitOrder, { ILimitOrderData } from '../models/LimitOrder';
// All properties on a domain are optional
const getDomain = (chainId: number, verifyingContract: string) => ({
  name: 'LiquiGate',
  version: '1',
  chainId: chainId,
  verifyingContract,
});

// The named list of all type definitions
const limitOrderTypes = {
  Maker: [
    { name: 'amount', type: 'uint256' },
    { name: 'asset', type: 'address' },
  ],
  Taker: [
    { name: 'amount', type: 'uint256' },
    { name: 'asset', type: 'address' },
  ],
  LimitOrder: [
    { name: 'address', type: 'address' },
    { name: 'chainId', type: 'uint256' },
    { name: 'maker', type: 'Maker' },
    { name: 'taker', type: 'Taker' },
    { name: 'expiry', type: 'uint256' },
  ],
};

export const sign = async (
  signer: ethers.providers.JsonRpcSigner,
  chainId: number,
  limitOrder: LimitOrder,
  orderContractAddress: string
) => {
  const order = {
    ...limitOrder,
    expiry: limitOrder.expiry?.toString(),
    taker: {
      ...limitOrder.taker,
      amount: limitOrder.taker.amount.toString(),
    },
    maker: {
      ...limitOrder.maker,
      amount: limitOrder.maker.amount.toString(),
    },
  };
  const domain = getDomain(chainId, orderContractAddress);
  const signature = await signer._signTypedData(domain, limitOrderTypes, order);
  return signature;
};

export const verify = (
  expectedAddress: string,
  chainId: number,
  order: LimitOrder,
  signature: string,
  orderContractAddress: string
): boolean => {
  const domain = getDomain(chainId, orderContractAddress);
  const recoveredAddress = ethers.utils.verifyTypedData(domain, limitOrderTypes, order, signature);

  return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
};
