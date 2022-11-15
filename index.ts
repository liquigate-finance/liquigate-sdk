import { JsonRpcSigner } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { ERC20ABI } from '../contract-abis';
import { ERC20 } from '../contract-types';
import { TokenConfig } from './chain-config/chain-config.service';
import { ICoinData } from './Coin';
import LimitOrder from './LimitOrder';
class Exchange {
  chainId: number;
  account: string;
  contractAddress: string;
  supportedCoins: Array<ICoinData>;
  provider: ethers.providers.Web3Provider;
  signer: ethers.providers.JsonRpcSigner;
  constructor({
    chainId,
    account,
    provider,
    signer,
  }: {
    chainId: number;
    account: string;
    provider: ethers.providers.Web3Provider;
    signer: ethers.providers.JsonRpcSigner;
  }) {
    this.chainId = chainId;
    this.account = account;
    const chainConfig = ConfigUtils.getChainConfig(chainId);
    if (!chainConfig) {
      throw new Error('Chain is not supported');
    }
    this.contractAddress = chainConfig.limitOrderContractAddress;
    this.supportedCoins = chainConfig.coins;
    this.provider = provider;
    this.signer = signer;
  }
  async approveTokenSpending(token: string, amount: number): Promise<boolean | undefined> {
    try {
      const tokenContract = new ethers.Contract(token, ERC20ABI as any, this.signer) as never as ERC20;
      const decimals = await tokenContract.decimals();
      const amountWithDecimals = ethers.utils.parseUnits(amount.toString(), decimals);
      const transaction = await tokenContract.approve(this.contractAddress, amountWithDecimals);
      await transaction.wait();
      return true;
    } catch (error: any) {
      if (error.code !== 4001) {
        throw error;
      }
    }
  }
  async signLimitOrder(limitOrder: LimitOrder) {
    try {
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
      const signature = await LimitOrderUtils.sign(this.signer as any, this.chainId, order as any);
      return signature;
    } catch (error: any) {
      if (error.code !== 4001) {
        throw error;
      }
    }
  }
  async getAllowance(token: string): Promise<ethers.BigNumber> {
    const tokenContract = new ethers.Contract(token, ERC20ABI as any, this.signer) as never as ERC20;
    return await tokenContract.allowance(this.account, this.contractAddress);
  }
  async checkAllowance(token: string, amount: number) {
    const tokenContract = new ethers.Contract(token, ERC20ABI as any, this.signer) as never as ERC20;
    const allowance = await this.getAllowance(token);
    const decimals = await tokenContract.decimals();
    const amountWithDecimals = ethers.utils.parseUnits(amount.toString(), decimals);
    return allowance.gte(amountWithDecimals);
  }
}
export default Exchange;
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
export abstract class Liquigate {
  provider: ethers.providers.Provider;
  signer: ethers.Signer;

  constructor(provider: ethers.providers.Provider, signer: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;
  }
  getSupportedTokens(chainId: number): TokenConfig[] {
    return 0 as any;
  }
  getUserBalances(address: string): Array<{ token: TokenConfig; amount: string }> {
    return 0 as any;
  }
  approveUserToContract(): boolean {
    return true;
  }
  swapTokens(
    maker: {
      asset: string;
      amount: string;
    },
    taker: {
      asset: string;
      amount: string;
    },
    expiry?: number
  ): string {
    return '';
  }
  swapTokensAndTransfer(
    maker: {
      asset: string;
      amount: string;
    },
    taker: {
      asset: string;
      amount: string;
    },
    destinationAddress: string,
    expiry?: number
  ): string {
    return '';
  }
}
