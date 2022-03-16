# Wave Portal

## Deploy contract locally

```shell
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

## Deploy contract to Rinkeby Ethereum Test Network

- Update `hardhat.config.js` with the actual rinkeby url and ethereum account
- Run `npx hardhat run scripts/deploy.js --network rinkeby`
