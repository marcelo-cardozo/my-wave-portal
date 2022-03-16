const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();

  // compile contract and generate files to work with the contract
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  // create new local ethereum network to deploy this contract and deploy contract
  const waveContract = await waveContractFactory.deploy();
  // wait for contract deployment to hardhat ethereum network
  await waveContract.deployed();

  console.log("Contract deployed  to:", waveContract.address);
  console.log("Contract deployed  by:", owner.address);
  console.log("Random person address:", randomPerson.address);

  let waveTotalCount;

  waveTotalCount = await waveContract.getTotalWaves();

  let waveTxn = await waveContract.wave();
  await waveTxn.wait();

  waveTxn = await waveContract.wave();
  await waveTxn.wait();

  waveTotalCount = await waveContract.getTotalWaves();

  waveTxn = await waveContract.connect(randomPerson).wave();
  await waveTxn.wait();

  waveTotalCount = await waveContract.getTotalWaves();

  await waveContract.getMyTotalWaves();

  await waveContract.connect(randomPerson).getMyTotalWaves();
};

const runMain = async () => {
  try {
    await main();
    process.exit(0); // exit Node process without error
  } catch (error) {
    console.log(error);
    process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
  }

  // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
};

runMain();
