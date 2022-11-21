import { ContractFactory, ethers } from 'ethers';
import Ganache from 'ganache-core';
import { instantiateContract } from './compile-sol';
export const PRIV_KEY = 'ecab8a22c4a70eb560df0cb8074e16e853a235992b40d0218ad2204d83630a31';

export const startChain = async () => {
  const key = Buffer.from(PRIV_KEY, 'hex');

  const ganache = Ganache.provider({
    accounts: [
      {
        secretKey: key,
        balance: ethers.utils.hexlify(ethers.utils.parseEther('1000')),
      },
    ],
  });
  const provider = new ethers.providers.Web3Provider(ganache as any);
  const wallet = new ethers.Wallet(PRIV_KEY, provider);

  // 1. Compile contract artifact
  const compiled = instantiateContract('../contracts/TokenA.sol');
  // 3. Create initial contract instance
  const factory = new ContractFactory(compiled.abi, compiled.bytecode, wallet);

  const token = await factory.deploy();

  return {
    wallet,
    chain: ganache,
    provider,
    contracts: {
      tokenA: token,
    },
  };
};
