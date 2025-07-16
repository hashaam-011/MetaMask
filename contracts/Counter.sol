// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Counter {
    uint public count;

    // Event to be emitted when the counter is changed
    event CounterChanged(uint newCount);

    function increment() public {
        count++;
        emit CounterChanged(count);
    }

    function decrement() public {
        count--;
        emit CounterChanged(count);
    }
}
