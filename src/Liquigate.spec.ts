import { ethers } from 'ethers';
import Ganache from 'ganache-core';
import { startChain } from './test/start-chain';

describe('Liquigate SDK specs', () => {
  let wallet: ethers.Wallet, chain: Ganache.Provider, provider: ethers.providers.Web3Provider;
  beforeAll(async () => {
    const config = await startChain();
    wallet = config.wallet;
    chain = config.chain;
    provider = config.provider;
  });

  it('it should return true', async () => {
    const balance = Number(ethers.utils.formatEther(await wallet.getBalance()));
    expect(balance).toEqual(1000);
  });

  afterAll(() => {
    chain.close(() => true);
  });
});
