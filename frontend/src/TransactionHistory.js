import React, { useState } from 'react';
import './TransactionHistory.css';

const ACTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Increment', value: 'increment' },
  { label: 'Decrement', value: 'decrement' },
  { label: 'Reset', value: 'reset' },
];

function getRelativeTime(timestamp) {
  const now = Date.now();
  const diff = now - Number(timestamp) * 1000;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hr ago`;
  return `${Math.floor(diff / 86400000)} days ago`;
}

const TransactionHistory = ({ transactions, loading, onClearHistory }) => {
  const [filter, setFilter] = useState('all');
  const [copiedIndex, setCopiedIndex] = useState(null);

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

  const filteredTransactions = filter === 'all'
    ? Array.from(transactions)
    : Array.from(transactions).filter(tx => tx.action === filter);

  // For highlighting, get the most recent transaction index (after filtering and reversing)
  const reversedFiltered = filteredTransactions.slice().reverse();
  const mostRecentIndex = 0; // first in reversedFiltered

  const handleCopy = (address, idx) => {
    navigator.clipboard.writeText(address);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1200);
  };

  if (loading) {
    return (
      <div className="transaction-history">
        <h3>Transaction History</h3>
        <div className="loading-spinner" aria-label="Loading transactions">Loading...</div>
      </div>
    );
  }

  return (
    <div className="transaction-history">
      <div className="transaction-history-header">
        <h3>Transaction History</h3>
        <div className="transaction-controls">
          <select
            aria-label="Filter transactions by action"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="transaction-filter"
          >
            {ACTIONS.map(action => (
              <option key={action.value} value={action.value}>{action.label}</option>
            ))}
          </select>
          <button
            className="clear-history-btn"
            onClick={onClearHistory}
            aria-label="Clear transaction history"
            disabled={transactions.length === 0}
          >
            Clear History
          </button>
        </div>
      </div>
      <div className="transaction-counts" style={{marginBottom: '8px', fontSize: '0.95em', color: '#555'}}>
        Showing {filteredTransactions.length} of {transactions.length} transactions
      </div>
      {filteredTransactions.length === 0 ? (
        <div className="no-transactions improved-empty-state" aria-label="No transactions">
          <p>🚫 No transactions found for the selected filter.<br/>Try performing an action or change the filter above!</p>
        </div>
      ) : (
        <div className="transactions-list">
          {reversedFiltered.map((tx, index) => (
            <div
              key={index}
              className="transaction-item"
              style={index === mostRecentIndex ? {border: '2px solid #2196F3', background: '#e3f2fd'} : {}}
            >
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
                  <span
                    className="transaction-user"
                    style={{ cursor: 'pointer', textDecoration: 'underline dotted' }}
                    onClick={() => handleCopy(tx.user, index)}
                    tabIndex={0}
                    aria-label="Copy user address"
                    onKeyDown={e => { if (e.key === 'Enter') handleCopy(tx.user, index); }}
                  >
                    By: {formatAddress(tx.user)}
                    {copiedIndex === index && <span style={{marginLeft: 6, color: '#4CAF50'}}>Copied!</span>}
                  </span>
                  <span className="transaction-time" title={formatTimestamp(tx.timestamp)}>
                    {getRelativeTime(tx.timestamp)}
                  </span>
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