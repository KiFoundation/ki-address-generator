<p align="right">
    <img width=150px src="https://wallet-testnet.blockchain.ki/static/img/icons/ki-chain.png" />
</p>

# Ki Address Generator

This repository hosts `ki-address-generator`, a desktop Ki address generator to prepare the launch of the Ki Mainnet.

## Functionalities

The generator allows to:

-   Generate and verify random mnemonics.
-   Derive and display Mainnet key pairs.
-   Prepare and share account json file to be included in the genesis file.

## How to run The  Ki Address Generator
To run the Ki address generator you need first to build the it and then to run it or package it in electron.
### Build the generator

```bash
# Install the wallet dependencies
cd ki-address-generator/app && npm install

# Build thewallet with minification
./build.sh
```

You can also serve the app in your browser with hot reload at localhost

```bash
npm run dev
```

### Run and package in electron

```bash
# Go into the parent repository and install dependencies
cd .. && npm install

# Run the app in dev mode
npm start

# Build the app for macOS
npm run package-mac

# Build the app for Windows
npm run package-win

# Build the app for Debian distributions
npm run package-linux
```

## Security
If you discover a security vulnerability in this project, please report it to security@foundation.ki. We will promptly address all security vulnerabilities.

**Disclaimer**
The app uses code parts from the [math-cosmos-web-wallet](https://github.com/mathwallet/math-cosmos-web-wallet) project by [MathWallet](https://github.com/mathwallet).
