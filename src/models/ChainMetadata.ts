export interface NativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface Features {
  eip1559: boolean;
  fakeState: boolean;
}

export interface NetworkParameters {
  chainId: number;
  networkId: number;
  features: Features;
}

export interface Gas {
  txMinimumGas: number;
  blockGasLimit: number;
}

export interface Endpoints {
  wsUrls: string[];
  httpUrls: string[];
}

export interface AddressesConvertor {}

export interface BlockExplorer {
  url: string;
  type: number;
  apiKeys: any[];
}

export interface Contracts {
  limitOrder: string;
}

export class ChainMetadata {
  chain!: string;
  secondaryNames!: string[];
  nativeCurrency!: NativeCurrency;
  networkParameters!: NetworkParameters;
  capitalizationAsset!: string;
  interestingAssets!: string[];
  supportedProtocols!: string[];
  gas!: Gas;
  endpoints!: Endpoints;
  addressesConvertor!: AddressesConvertor;
  blockExplorers!: BlockExplorer[];
  liquigateContracts!: Contracts;

  constructor(partial: Partial<ChainMetadata>) {
    Object.assign(this, partial);
  }
}
