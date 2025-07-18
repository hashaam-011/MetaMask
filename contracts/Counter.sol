// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Counter {
    uint public count;
    
    struct Transaction {
        address user;
        string action;
        uint256 value;
        uint256 timestamp;
        uint256 blockNumber;
    }
    
    Transaction[] public transactions;
    uint256 public constant MAX_TRANSACTIONS = 50;

    event CounterChanged(uint newCount);
    event CounterChangedWithTimestamp(uint newCount, uint256 timestamp);
    event TransactionRecorded(address user, string action, uint256 value, uint256 timestamp);

    function increment() public payable {
        require(msg.value >= 0.01 ether, "Insufficient payment");
        count++;
        _recordTransaction("increment", count);
        emit CounterChanged(count);
        emit CounterChangedWithTimestamp(count, block.timestamp);
    }

    function decrement() public payable {
        require(msg.value >= 0.01 ether, "Insufficient payment");
        count--;
        _recordTransaction("decrement", count);
        emit CounterChanged(count);
        emit CounterChangedWithTimestamp(count, block.timestamp);
    }
    
    function reset() public payable {
        require(msg.value >= 0.05 ether, "Insufficient payment for reset");
        count = 0;
        _recordTransaction("reset", count);
        emit CounterChanged(count);
        emit CounterChangedWithTimestamp(count, block.timestamp);
    }
    
    function _recordTransaction(string memory action, uint256 value) internal {
        Transaction memory newTx = Transaction({
            user: msg.sender,
            action: action,
            value: value,
            timestamp: block.timestamp,
            blockNumber: block.number
        });
        
        transactions.push(newTx);
        
        // Keep only the last MAX_TRANSACTIONS
        if (transactions.length > MAX_TRANSACTIONS) {
            // Remove oldest transaction (shift array)
            for (uint i = 0; i < transactions.length - 1; i++) {
                transactions[i] = transactions[i + 1];
            }
            transactions.pop();
        }
        
        emit TransactionRecorded(msg.sender, action, value, block.timestamp);
    }
    
    function getTransactionHistory() public view returns (Transaction[] memory) {
        return transactions;
    }
    
    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }
}
