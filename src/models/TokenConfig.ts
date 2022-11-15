interface Identifiers {
  coingecko: string;
}

interface EtlStatus {
  contractValidation: string;
  circleEligability: string;
  manualAction: string;
  poolCount: number;
  transferRateEstimationStatus: string;
  transferRateEstimation: number;
}

export class TokenConfig {
  address!: string;
  name!: string;
  symbol!: string;
  decimals!: number;
  transferRate!: number;
  icon!: string;
  bridges!: string[];
  identifiers!: Identifiers;
  etlStatus!: EtlStatus;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<TokenConfig>) {
    Object.assign(this, partial);
  }

  getCoingekoSymbol() {
    return this.identifiers?.coingecko;
  }
}
