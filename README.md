# Wave Portal

## Deploy contract locally

- Run `npx hardhat node` in a terminal
- Deploy contract to hardhat test network doing: `npx hardhat run scripts/deploy.js --network localhost`
- Connect metamask to local hardhat test network
- Update contract address inside `App.js`
- Update contract `abi` with the generated json located at `artifacts/contracts/WavePorta.sol/WavePortal.json`

## Deploy contract to Rinkeby Ethereum Test Network

- Update `hardhat.config.js` with the actual rinkeby url and ethereum account
- Run `npx hardhat run scripts/deploy.js --network rinkeby`
- Select rinkeby network in metamask
- Update contract address inside `App.js`
- Update contract `abi` with the generated json located at `artifacts/contracts/WavePorta.sol/WavePortal.json`
