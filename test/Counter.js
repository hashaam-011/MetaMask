const { expect } = require("chai");

describe("Counter", function () {
  let counter;

  beforeEach(async function () {
    const Counter = await ethers.getContractFactory("Counter");
    counter = await Counter.deploy();
    await counter.waitForDeployment();
  });

  it("Should return the initial count of 0", async function () {
    expect(await counter.count()).to.equal(0);
  });

  it("Should increment the count by 1", async function () {
    await counter.increment();
    expect(await counter.count()).to.equal(1);
  });

  it("Should decrement the count by 1", async function () {
    await counter.increment(); // Increment first to avoid underflow
    await counter.decrement();
    expect(await counter.count()).to.equal(0);
  });

  it("Should emit a CounterChanged event on increment", async function () {
    await expect(counter.increment())
      .to.emit(counter, "CounterChanged")
      .withArgs(1);
  });

  it("Should emit a CounterChanged event on decrement", async function () {
    await counter.increment(); // Increment first to avoid underflow
    await expect(counter.decrement())
      .to.emit(counter, "CounterChanged")
      .withArgs(0);
  });
}); 