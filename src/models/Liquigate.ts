import { JsonRpcSigner } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { createLimitOrder, getChainTokens } from '../services';
import { getUserTokensBalances } from '../services/get-user-tokens-balances';
import { ERC20 } from '../contract-types';
import { ERC20ABI } from '../contract-abis';
import { getChainMetadata } from '../services/get-chain-metadata';
import * as LimitOrderSig from '../lib/limit-order-signature';
import { TokenConfig } from './TokenConfig';
import LimitOrder from './LimitOrder';
import { Contracts } from './ChainMetadata';

export class Liquigate {
  provider: ethers.providers.Provider;
  signer: ethers.Signer;
  contracts?: Contracts;

  constructor(provider: ethers.providers.Provider, signer: ethers.Signer, contracts?: Contracts) {
    this.provider = provider;
    this.signer = signer;
    this.contracts = contracts;
  }

  static fromKeyAndNode(privateKey: string, rpcNodeUrl: string) {
    const provider = new ethers.providers.JsonRpcProvider(rpcNodeUrl);
    const signer = new ethers.Wallet(privateKey, provider);

    return new Liquigate(provider, signer);
  }

  async init() {
    const { chainId } = await this.provider.getNetwork();
    const chainConfig = await getChainMetadata(chainId);

    this.contracts = chainConfig.liquigateContracts;
  }

  async getSupportedTokens(chainId: number): Promise<TokenConfig[]> {
    return getChainTokens(chainId);
  }

  async getUserBalances(address: string, chainId: number): Promise<Array<{ token: string; balance: number }>> {
    const balances = await getUserTokensBalances(address, chainId);

    return balances;
  }

  async approveTokenSpending(token: string, amount: number): Promise<boolean | undefined> {
    try {
      const tokenContract = new ethers.Contract(token, ERC20ABI as any, this.signer) as never as ERC20;
      const decimals = await tokenContract.decimals();
      const amountWithDecimals = ethers.utils.parseUnits(amount.toString(), decimals);
      const transaction = await tokenContract.approve('', amountWithDecimals);
      await transaction.wait();
      return true;
    } catch (error: any) {
      if (error.code !== 4001) {
        throw error;
      }
    }
  }
  async swapTokens(limitOrder: LimitOrder) {
    if (!this.contracts?.limitOrder) {
      return;
    }

    try {
      const { chainId } = await this.provider.getNetwork();
      const signature = await LimitOrderSig.sign(this.signer as any, chainId, limitOrder, this.contracts?.limitOrder);
      await createLimitOrder(limitOrder, signature);

      return signature;
    } catch (error: any) {
      if (error.code !== 4001) {
        throw error;
      }
    }
  }

  async swapAndTransfer(limitOrder: LimitOrder, destAddress: string) {
    //TODO: Implement this
  }
}
