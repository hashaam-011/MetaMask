import { ethers } from "ethers";
import { useEffect, useState } from "react";
import ContractData from "./contract-address.json";
import "./App.css";
import pic from "./as.png";
import TransactionHistory from "./TransactionHistory";

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [network, setNetwork] = useState(null);
  const [count, setCount] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timestamp, setTimestamp] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [gasEstimate, setGasEstimate] = useState(null);
  const [userBalance, setUserBalance] = useState(null);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setWalletAddress(accounts[0]);
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setNetwork(null);
    setContract(null);
    setCount(null);
    setError("");
    setTransactions([]);
    setGasEstimate(null);
    setUserBalance(null);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const fetchTransactionHistory = async (contractInstance) => {
    try {
      const history = await contractInstance.getTransactionHistory();
      setTransactions(JSON.parse(JSON.stringify(history)));
    } catch (err) {
      console.error("Failed to fetch transaction history:", err);
    }
  };

  const estimateGas = async (contractInstance, functionName, value) => {
    try {
      const gasEstimate = await contractInstance[functionName].estimateGas({ value });
      setGasEstimate(ethers.formatUnits(gasEstimate, "wei"));
    } catch (err) {
      console.error("Failed to estimate gas:", err);
      setGasEstimate("Error");
    }
  };

  const fetchUserBalance = async (provider, address) => {
    try {
      const balance = await provider.getBalance(address);
      setUserBalance(ethers.formatEther(balance));
    } catch (err) {
      console.error("Failed to fetch balance:", err);
    }
  };

  const connectWallet = async () => {
    setLoading(true);
    setError("");
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const networkInfo = await provider.getNetwork();

        if (networkInfo.chainId.toString() !== "31337") {
          setError("Please switch to the Hardhat Localhost network in MetaMask.");
          setLoading(false);
          return;
        }

        setWalletAddress(address);
        setNetwork(networkInfo);

        const counterContract = new ethers.Contract(ContractData.address, ContractData.abi, signer);
        setContract(counterContract);

        const currentCount = await counterContract.count();
        setCount(currentCount.toString());

        // Fetch initial data
        await fetchTransactionHistory(counterContract);
        await fetchUserBalance(provider, address);

        // Listen for the CounterChanged event
        counterContract.on("CounterChanged", (newCount) => {
          setCount(newCount.toString());
        });
        
        // Listen for the CounterChangedWithTimestamp event
        counterContract.on("CounterChangedWithTimestamp", (newCount, ts) => {
          setTimestamp(ts.toString());
        });

        // Listen for new transactions
        counterContract.on("TransactionRecorded", async () => {
          await fetchTransactionHistory(counterContract);
          await fetchUserBalance(provider, address);
        });

      } catch (err) {
        console.error(err);
        setError("Failed to connect wallet or fetch data. See console for details.");
      }
    } else {
      setError("Please install MetaMask to use this application.");
    }
    setLoading(false);
  };

  const increment = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.increment({ value: ethers.parseEther("0.01") });
      await tx.wait();
    } catch (err) {
      console.error(err);
      setError("Transaction failed. See console for details.");
    }
    setLoading(false);
  };

  const decrement = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.decrement({ value: ethers.parseEther("0.01") });
      await tx.wait();
    } catch (err) {
      console.error(err);
      setError("Transaction failed. See console for details.");
    }
    setLoading(false);
  };

  const reset = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.reset({ value: ethers.parseEther("0.05") });
      await tx.wait();
    } catch (err) {
      console.error(err);
      setError("Reset transaction failed. See console for details.");
    }
    setLoading(false);
  };

  const handleGasEstimate = async (functionName) => {
    if (!contract) return;
    const value = functionName === 'reset' ? ethers.parseEther("0.05") : ethers.parseEther("0.01");
    await estimateGas(contract, functionName, value);
  };

  const handleClearHistory = () => {
    setTransactions([]);
  };

  return (
    <div className="Dashboard">
      <aside className="Sidebar">
        <div className="Sidebar-header">
          <img src={pic} alt="logo" className="Sidebar-logo" />
          <h1>Counter Dashboard</h1>
        </div>
        <div className="Sidebar-user">
          {walletAddress ? (
            <>
              <p><strong>Account:</strong></p>
              <p className="Sidebar-account">{`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}</p>
              <p><strong>Balance:</strong></p>
              <p className="Sidebar-balance">{userBalance ? `${parseFloat(userBalance).toFixed(4)} ETH` : "Loading..."}</p>
              <p><strong>Network:</strong></p>
              <p className="Sidebar-network">{network ? `${network.name} (Chain ID: ${network.chainId.toString()})` : "Not connected"}</p>
              <button onClick={disconnectWallet} className="disconnect-button">Disconnect</button>
            </>
          ) : (
            <button onClick={connectWallet} className="connect-button" disabled={loading}>
              {loading ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>
      </aside>
      <main className="Dashboard-main">
        <div className="card">
          <div className="counter-display">
            <h2>Counter Value</h2>
            <p className="count">{count}</p>
            {timestamp && (
              <p className="timestamp">Last change: {new Date(Number(timestamp) * 1000).toLocaleString()}</p>
            )}
          </div>
          
          {gasEstimate && (
            <div className="gas-estimate">
              <p>Estimated Gas: {gasEstimate} wei</p>
            </div>
          )}
          
          <div className="button-group">
            <button 
              onClick={increment} 
              className="action-button" 
              disabled={loading || !walletAddress}
              onMouseEnter={() => handleGasEstimate('increment')}
            >
              {loading ? "Processing..." : "Increment (0.01 ETH)"}
            </button>
            <button 
              onClick={decrement} 
              className="action-button" 
              disabled={loading || !walletAddress}
              onMouseEnter={() => handleGasEstimate('decrement')}
            >
              {loading ? "Processing..." : "Decrement (0.01 ETH)"}
            </button>
            <button 
              onClick={reset} 
              className="action-button reset-button" 
              disabled={loading || !walletAddress}
              onMouseEnter={() => handleGasEstimate('reset')}
            >
              {loading ? "Processing..." : "Reset (0.05 ETH)"}
            </button>
          </div>
        </div>
        
        <TransactionHistory transactions={transactions} loading={loading} onClearHistory={handleClearHistory} />
        
        {error && <p className="error-message">{error}</p>}
      </main>
    </div>
  );
}

export default App;
