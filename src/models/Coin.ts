export interface ICoinData {
  symbol: string;
  imageUrl: string;
  address: string;
  name: string;
  coingeckoSymbol: string;
}

class Coin {
  symbol: string;
  imageUrl: string;
  address: string;
  name: string;
  coingeckoSymbol: string;

  constructor({ symbol, imageUrl, address, name, coingeckoSymbol }: ICoinData) {
    this.symbol = symbol;
    this.imageUrl = imageUrl;
    this.address = address;
    this.name = name;
    this.coingeckoSymbol = coingeckoSymbol;
  }
}

export default Coin;
