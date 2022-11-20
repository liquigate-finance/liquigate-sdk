import BigNumber from 'bignumber.js';

export const toBigNumberString = (number: number | string, decimals: number) => {
  return BigNumber(BigNumber(number).toFixed(decimals))
    .multipliedBy(10 ** decimals)
    .toString();
};
