// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Counter {
    uint public count;

    event CounterChanged(uint newCount);
    event CounterChangedWithTimestamp(uint newCount, uint256 timestamp);

    function increment() public payable {
        require(msg.value >= 0.01 ether, "Insufficient payment");
        count++;
        emit CounterChanged(count);
        emit CounterChangedWithTimestamp(count, block.timestamp);
    }

    function decrement() public payable {
        require(msg.value >= 0.01 ether, "Insufficient payment");
        count--;
        emit CounterChanged(count);
        emit CounterChangedWithTimestamp(count, block.timestamp);
    }
}
