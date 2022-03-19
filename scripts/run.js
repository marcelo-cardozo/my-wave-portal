const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();

  // compile contract and generate files to work with the contract
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  // create new local ethereum network to deploy this contract and deploy contract
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  // wait for contract deployment to hardhat ethereum network
  await waveContract.deployed();

  console.log("Contract deployed  to:", waveContract.address);
  console.log("Contract deployed  by:", owner.address);
  console.log("Random person address:", randomPerson.address);

  /*
   * Get Contract balance
   */
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let waveTotalCount;
  waveTotalCount = await waveContract.getTotalWaves();

  console.log(
    "My initial balance:",
    hre.ethers.utils.formatEther(
      await hre.ethers.provider.getBalance(owner.address)
    )
  );
  let waveTxn = await waveContract.wave("message 1.1");
  await waveTxn.wait();

  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );
  console.log(
    "My balance:",
    hre.ethers.utils.formatEther(
      await hre.ethers.provider.getBalance(owner.address)
    )
  );

  waveTxn = await waveContract.wave("message 1.2");
  await waveTxn.wait();

  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );
  console.log(
    "My balance:",
    hre.ethers.utils.formatEther(
      await hre.ethers.provider.getBalance(owner.address)
    )
  );

  waveTotalCount = await waveContract.getTotalWaves();

  console.log(
    "Random person initial balance:",
    hre.ethers.utils.formatEther(
      await hre.ethers.provider.getBalance(randomPerson.address)
    )
  );
  waveTxn = await waveContract.connect(randomPerson).wave("message 2.1");
  await waveTxn.wait();
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );
  console.log(
    "Random person balance:",
    hre.ethers.utils.formatEther(
      await hre.ethers.provider.getBalance(randomPerson.address)
    )
  );

  waveTotalCount = await waveContract.getTotalWaves();

  await waveContract.getMyTotalWaves();

  await waveContract.connect(randomPerson).getMyTotalWaves();

  const allWaves = await waveContract.getAllWaves();
  console.log({ allWaves });
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
