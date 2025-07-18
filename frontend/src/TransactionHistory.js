import React from 'react';
import './TransactionHistory.css';

const TransactionHistory = ({ transactions, loading }) => {
  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatTimestamp = (timestamp) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'increment':
        return '#4CAF50';
      case 'decrement':
        return '#F44336';
      case 'reset':
        return '#FF9800';
      default:
        return '#2196F3';
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'increment':
        return '↗️';
      case 'decrement':
        return '↘️';
      case 'reset':
        return '🔄';
      default:
        return '📊';
    }
  };

  if (loading) {
    return (
      <div className="transaction-history">
        <h3>Transaction History</h3>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="transaction-history">
      <h3>Transaction History</h3>
      {transactions.length === 0 ? (
        <div className="no-transactions">
          <p>No transactions yet. Start by incrementing or decrementing the counter!</p>
        </div>
      ) : (
        <div className="transactions-list">
          {transactions.slice().reverse().map((tx, index) => (
            <div key={index} className="transaction-item">
              <div className="transaction-icon" style={{ backgroundColor: getActionColor(tx.action) }}>
                {getActionIcon(tx.action)}
              </div>
              <div className="transaction-details">
                <div className="transaction-header">
                  <span className="transaction-action" style={{ color: getActionColor(tx.action) }}>
                    {tx.action.charAt(0).toUpperCase() + tx.action.slice(1)}
                  </span>
                  <span className="transaction-value">Value: {tx.value.toString()}</span>
                </div>
                <div className="transaction-meta">
                  <span className="transaction-user">By: {formatAddress(tx.user)}</span>
                  <span className="transaction-time">{formatTimestamp(tx.timestamp)}</span>
                </div>
                <div className="transaction-block">
                  Block: {tx.blockNumber.toString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory; 