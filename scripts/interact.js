const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    console.error("Please set the CONTRACT_ADDRESS in your .env file");
    process.exit(1);
  }

  const Counter = await hre.ethers.getContractFactory("Counter");
  const counter = Counter.attach(contractAddress);

  const [signer] = await hre.ethers.getSigners();
  console.log("Using wallet:", signer.address);

  let currentCount = await counter.count();
  console.log("Current count:", currentCount.toString());

  console.log("Incrementing count...");
  const tx = await counter.increment();
  await tx.wait(); // Wait for the transaction to be mined

  let updatedCount = await counter.count();
  console.log("Updated count:", updatedCount.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
