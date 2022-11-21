# LiquigateSDK

LiquigateSDK is the official library for using liquigate product API

## Installation

Use the package manager [npm](https://pip.pypa.io/en/stable/) to install foobar.

```bash
npm install liquigate-sdk
```

## Usage

### Setup

#### Using ethers objects

```typescript
import { Liquigate } from 'liquigate-sdk';

const liquigate = new Liquigate(provider, wallet);
await liquigate.init();
```

#### Using rpc url and a private key

```typescript
import { Liquigate } from 'liquigate-sdk';

const PRIVATE_KEY = 'XXXXXXXXXXXXXXXXXXXXXXXXXXX';
const NODE_URL = 'http://localhost:8545';

const liquigate = new Liquigate.fromKeyAndNode(PRIVATE_KEY, NODE_URL);
await liquigate.init();
```

### Get chain supported tokens

```typescript
const tokens = await liquigate.getSupportedTokens(1);
```

### Approve to liquigate contract

```typescript
const TOKEN_ADDRESS = 'XXXXXXXXXXXXXXXXXX';
const amount = 5.1; // Amount should be with no decimals conversion;
await liquigate.approveTokenSpending(TOKEN_ADDRESS, amount);
```

#### Create Trade

```typescript
const walletAddress = 'XXXXXXXXXXXXXXXXXXX';
const tokenList = await liquigate.getSupportedTokens(1);
const makerAmount = 5.1; // Amount should be with no decimals conversion;
const takerAmount = 2;
const makerToken = tokenList[0];
const takerToken = tokenList[1];
await liquigate.approveTokenSpending(makerToken.address, amount);
const order = new LimitOrder({
  address: walletAddress,
  chainId,
  maker: {
    asset: makerToken,
    amount: makerAmount,
  },
  taker: {
    asset: takerToken,
    amount: takerAmount,
  },
  expiry: Date.now() + 999999999,
});
await liquigate.swapTokens(order);
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
