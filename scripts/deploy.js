const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const Counter = await hre.ethers.getContractFactory("Counter");
  const counter = await Counter.deploy();
  await counter.waitForDeployment();

  console.log("Counter deployed to:", counter.target);

  // Save the contract's address and ABI
  const data = {
    address: counter.target,
    abi: JSON.parse(fs.readFileSync("./artifacts/contracts/Counter.sol/Counter.json", "utf8")).abi,
  };

  // This writes the ABI and address to the frontend directory
  fs.writeFileSync("./frontend/src/contract-address.json", JSON.stringify(data));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
