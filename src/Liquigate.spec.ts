import { ethers } from 'ethers';
import Ganache from 'ganache-core';
import { rest } from 'msw';
import { server } from './mocks/server';
import { ERC20 } from './contract-types';
import { Liquigate } from './models/Liquigate';
import { startChain } from './test/start-chain';
import { baseUrl } from './services/urls';
import TokenList from './mocks/token-list.json';
import { TokenConfig } from './models/TokenConfig';
import { LimitOrder } from './models';
import { verify } from './lib/limit-order-signature';

describe('Liquigate SDK specs', () => {
  let wallet: ethers.Wallet, chain: Ganache.Provider, provider: ethers.providers.Web3Provider;
  let tokenAERC: ERC20;
  let tokenAContract: ethers.Contract;
  let liquigate: Liquigate;
  let chainId: number;
  let walletAddress: string;

  beforeEach(async () => {
    const config = await startChain();
    wallet = config.wallet;
    chain = config.chain;
    provider = config.provider;
    tokenAERC = config.contracts.tokenA as any;
    tokenAContract = config.contracts.tokenA;
    liquigate = new Liquigate(provider, wallet, {
      limitOrder: '0x29D7d1dd5B6f9C864d9db560D72a247c178aE86B',
    });
    chainId = (await provider.getNetwork()).chainId;
    walletAddress = await wallet.getAddress();
  });

  describe('approveTokenSpending', () => {
    const COIN_AMOUNT_ALLOWANCE = 10;

    describe('When user is not allowed to contract', () => {
      it('It should set contract allowance', async () => {
        await liquigate.approveTokenSpending(tokenAContract.address, COIN_AMOUNT_ALLOWANCE);
        const allowance = await tokenAERC.allowance(wallet.address, liquigate.contracts?.limitOrder as any);

        expect(allowance).toEqual(ethers.utils.parseUnits(`${COIN_AMOUNT_ALLOWANCE}`, 18));
      });

      it('It should return true', async () => {
        const res = await liquigate.approveTokenSpending(tokenAContract.address, COIN_AMOUNT_ALLOWANCE);

        expect(res).toBeTruthy();
      });
    });

    describe('When user is allowed to contract', () => {
      it('It should set contract allowance', async () => {
        await tokenAERC.approve(
          liquigate.contracts?.limitOrder as any,
          ethers.utils.parseUnits(`${COIN_AMOUNT_ALLOWANCE}`, 18).toString()
        );
        await liquigate.approveTokenSpending(tokenAContract.address, COIN_AMOUNT_ALLOWANCE);
        const allowance = await tokenAERC.allowance(wallet.address, liquigate.contracts?.limitOrder as any);

        expect(allowance).toEqual(ethers.utils.parseUnits(`${COIN_AMOUNT_ALLOWANCE}`, 18));
      });

      it('It should return true', async () => {
        await tokenAERC.approve(
          liquigate.contracts?.limitOrder as any,
          ethers.utils.parseUnits(`${COIN_AMOUNT_ALLOWANCE}`, 18).toString()
        );
        const res = await liquigate.approveTokenSpending(tokenAContract.address, COIN_AMOUNT_ALLOWANCE);

        expect(res).toBeTruthy();
      });
    });
  });

  describe('swapTokens', () => {
    beforeEach(() => {
      server.use(
        ...[
          rest.post(`${baseUrl}/order`, (req, res, ctx) => {
            return res(ctx.status(200));
          }),
        ]
      );
    });
    const COIN_AMOUNT_ALLOWANCE = 10;

    describe('When user is allowed to contract', () => {
      it('It should create order', async () => {
        await liquigate.approveTokenSpending(tokenAContract.address, COIN_AMOUNT_ALLOWANCE);
        const order = new LimitOrder({
          address: walletAddress,
          chainId,
          maker: {
            asset: new TokenConfig({
              ...TokenList[0],
              address: tokenAContract.address,
            } as any),
            amount: COIN_AMOUNT_ALLOWANCE,
          },
          taker: {
            asset: new TokenConfig(TokenList[1] as any),
            amount: 2,
          },
        });
        const sig = await liquigate.swapTokens(order);
        const isVerified = await verify(
          walletAddress,
          chainId,
          order.toRaw(),
          sig as string,
          liquigate.contracts?.limitOrder as string
        );

        expect(isVerified).toBeTruthy();
      });
    });

    describe('When user is not allowed to contract', () => {
      it('It should throw error', async () => {
        const order = new LimitOrder({
          address: walletAddress,
          chainId,
          maker: {
            asset: new TokenConfig({
              ...TokenList[0],
              address: tokenAContract.address,
            } as any),
            amount: COIN_AMOUNT_ALLOWANCE,
          },
          taker: {
            asset: new TokenConfig(TokenList[1] as any),
            amount: 2,
          },
        });

        try {
          await liquigate.swapTokens(order);
        } catch (error) {
          expect(!!error).toBeTruthy();
        }
      });
    });
  });

  afterAll(() => {
    chain.close(() => true);
  });
});
