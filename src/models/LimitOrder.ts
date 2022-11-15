import { ethers } from 'ethers';

export interface ILimitOrderData {
  address: string;
  chainId: number;
  maker: {
    asset: string;
    amount: string;
  };
  taker: {
    asset: string;
    amount: string;
  };
  expiry?: number;
}

export class ViewLimitOrder {
  id!: string;
  createdAt!: Date;
  executedAt!: Date;
  expirationDate!: Date;
  makerAddress!: string;
  makerAsset!: string;
  takerAsset!: string;
  initialMakingAmount!: string; //Big int
  remainingMakingAmount!: string;
  takingAmount!: string; // Big int
  status!: string;
  chainId!: number;

  constructor({
    id,
    createdAt,
    executedAt,
    makerAddress,
    makerAsset,
    initialMakingAmount,
    remainingMakingAmount,
    status,
    takerAsset,
    takingAmount,
    chainId,
    expirationDate,
  }: {
    id: string;
    createdAt: string;
    executedAt: string;
    expirationDate: string;
    makerAddress: string;
    makerAsset: string;
    takerAsset: string;
    initialMakingAmount: string;
    takingAmount: string;
    status: string;
    remainingMakingAmount: string;
    chainId: string;
  }) {
    Object.assign(this, {
      id,
      createdAt: new Date(createdAt),
      executedAt: new Date(executedAt),
      expirationDate: new Date(expirationDate),
      makerAddress,
      makerAsset,
      initialMakingAmount,
      remainingMakingAmount,
      status,
      takerAsset,
      chainId: Number(chainId),
      takingAmount,
    });
  }
}

class LimitOrder {
  address: string;
  chainId: number;
  maker: {
    asset: string;
    amount: string;
  };
  taker: {
    asset: string;
    amount: string;
  };
  expiry?: number;

  constructor({ address, chainId, maker, taker, expiry }: ILimitOrderData) {
    this.address = address;
    this.chainId = chainId;
    this.maker = maker;
    this.taker = taker;
    this.expiry = expiry;
  }
}

export default LimitOrder;
