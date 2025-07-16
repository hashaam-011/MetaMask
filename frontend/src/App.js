import { ethers } from "ethers";
import { useEffect, useState } from "react";
import ContractData from "./contract-address.json";
import "./App.css";
import pic from "./as.png";

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [network, setNetwork] = useState(null);
  const [count, setCount] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

        // Listen for the CounterChanged event
        counterContract.on("CounterChanged", (newCount) => {
          setCount(newCount.toString());
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
      const tx = await contract.increment();
      await tx.wait();
      // The UI will be updated by the event listener, so we don't need to manually fetch the count here.
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
      const tx = await contract.decrement();
      await tx.wait();
      // The UI will be updated by the event listener, so we don't need to manually fetch the count here.
    } catch (err) {
      console.error(err);
      setError("Transaction failed. See console for details.");
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={pic} alt="logo" />
        <p className="description">A demo application to interact with a Solidity smart contract.</p>
      </header>
      <main className="App-main">
        {!walletAddress ? (
          <button onClick={connectWallet} className="connect-button" disabled={loading}>
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        ) : (
          <div className="card">
            <div className="account-info">
              <p><strong>Connected Account:</strong> {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}</p>
              <p><strong>Network:</strong> {network.name} (Chain ID: {network.chainId.toString()})</p>
            </div>
            <div className="counter-display">
              <h2>Counter Value</h2>
              <p className="count">{count}</p>
            </div>
            <div className="button-group">
              <button onClick={increment} className="action-button" disabled={loading}>
                {loading ? "Processing..." : "Increment"}
              </button>
              <button onClick={decrement} className="action-button" disabled={loading}>
                {loading ? "Processing..." : "Decrement"}
              </button>
            </div>
            <button onClick={disconnectWallet} className="disconnect-button">
              Disconnect
            </button>
          </div>
        )}
        {error && <p className="error-message">{error}</p>}
      </main>
    </div>
  );
}

export default App;
