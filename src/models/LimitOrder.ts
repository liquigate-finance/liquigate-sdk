import { toBigNumberString } from '../lib/big-number-string';
import { TokenConfig } from './TokenConfig';

export type RawLimitOrder = {
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
};

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

export interface ILimitOrderData {
  address: string;
  chainId: number;
  maker: {
    asset: TokenConfig;
    amount: number;
  };
  taker: {
    asset: TokenConfig;
    amount: number;
  };
  expiry: number;
}

class LimitOrder {
  address!: string;
  chainId!: number;
  maker!: {
    asset: TokenConfig;
    amount: number;
  };
  taker!: {
    asset: TokenConfig;
    amount: number;
  };
  expiry!: number;

  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(partial: ILimitOrderData) {
    Object.assign(this, partial);
  }

  toRaw(): RawLimitOrder {
    const order = {
      ...this,
      expiry: this.expiry?.toString(),
      taker: {
        asset: this.taker.asset.address,
        amount: toBigNumberString(this.taker.amount.toString(), this.taker.asset.decimals),
      },
      maker: {
        asset: this.maker.asset.address,
        amount: toBigNumberString(this.maker.amount.toString(), this.maker.asset.decimals),
      },
    };

    return order;
  }
}

export default LimitOrder;
