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

### Setup

#### Approve to liquigate contract

#### Create Trade

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
