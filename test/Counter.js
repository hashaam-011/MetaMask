const { expect } = require("chai");

describe("Counter", function () {
  let counter;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const Counter = await ethers.getContractFactory("Counter");
    counter = await Counter.deploy();
    await counter.waitForDeployment();
  });

  it("Should return the initial count of 0", async function () {
    expect(await counter.count()).to.equal(0);
  });

  it("Should increment the count by 1", async function () {
    await counter.increment({ value: ethers.parseEther("0.01") });
    expect(await counter.count()).to.equal(1);
  });

  it("Should decrement the count by 1", async function () {
    await counter.increment({ value: ethers.parseEther("0.01") }); // Increment first to avoid underflow
    await counter.decrement({ value: ethers.parseEther("0.01") });
    expect(await counter.count()).to.equal(0);
  });

  it("Should reset the count to 0", async function () {
    await counter.increment({ value: ethers.parseEther("0.01") });
    await counter.increment({ value: ethers.parseEther("0.01") });
    await counter.reset({ value: ethers.parseEther("0.05") });
    expect(await counter.count()).to.equal(0);
  });

  it("Should emit a CounterChanged event on increment", async function () {
    await expect(counter.increment({ value: ethers.parseEther("0.01") }))
      .to.emit(counter, "CounterChanged")
      .withArgs(1);
  });

  it("Should emit a CounterChanged event on decrement", async function () {
    await counter.increment({ value: ethers.parseEther("0.01") }); // Increment first to avoid underflow
    await expect(counter.decrement({ value: ethers.parseEther("0.01") }))
      .to.emit(counter, "CounterChanged")
      .withArgs(0);
  });

  it("Should emit a CounterChanged event on reset", async function () {
    await counter.increment({ value: ethers.parseEther("0.01") });
    await expect(counter.reset({ value: ethers.parseEther("0.05") }))
      .to.emit(counter, "CounterChanged")
      .withArgs(0);
  });

  it("Should record transactions in history", async function () {
    await counter.increment({ value: ethers.parseEther("0.01") });
    await counter.decrement({ value: ethers.parseEther("0.01") });
    
    const history = await counter.getTransactionHistory();
    expect(history.length).to.equal(2);
    expect(history[0].action).to.equal("increment");
    expect(history[1].action).to.equal("decrement");
  });

  it("Should emit TransactionRecorded events", async function () {
    await expect(counter.increment({ value: ethers.parseEther("0.01") }))
      .to.emit(counter, "TransactionRecorded")
      .withArgs(owner.address, "increment", 1, await time());
  });

  it("Should require sufficient payment for operations", async function () {
    await expect(counter.increment({ value: ethers.parseEther("0.005") }))
      .to.be.revertedWith("Insufficient payment");
    
    await expect(counter.decrement({ value: ethers.parseEther("0.005") }))
      .to.be.revertedWith("Insufficient payment");
    
    await expect(counter.reset({ value: ethers.parseEther("0.01") }))
      .to.be.revertedWith("Insufficient payment for reset");
  });
});

// Helper function to get current timestamp
async function time() {
  const blockNum = await ethers.provider.getBlockNumber();
  const block = await ethers.provider.getBlock(blockNum);
  return block.timestamp;
} 