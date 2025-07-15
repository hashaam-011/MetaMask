# Simple Counter dApp

This project is a complete, full-stack decentralized application (dApp) that demonstrates the interaction between a React frontend and a Solidity smart contract on a local Hardhat blockchain network.

The application features a simple "Counter" smart contract that can increment and decrement a number. The frontend provides a clean, user-friendly interface for users to connect their MetaMask wallet, view the current count, and send transactions to modify the state of the smart contract.

## Features

-   **Solidity Smart Contract**: A simple `Counter.sol` contract with increment and decrement functions.
-   **Hardhat Development Environment**: Full setup for compiling, testing, and deploying the smart contract.
-   **React Frontend**: A modern, responsive frontend built with React.
-   **Ethers.js Integration**: Connects the frontend to the blockchain, handles wallet connections, and sends transactions.
-   **On-Demand Wallet Connection**: Users can connect and disconnect their MetaMask wallet.
-   **Dynamic UI**: The interface updates based on the wallet's connection status and displays the connected account and network.
-   **Automated Deployment Scripts**: Scripts to deploy the contract and automatically update the frontend with the new contract address and ABI.

## Tech Stack

-   **Backend**: Solidity, Hardhat
-   **Frontend**: React, Ethers.js, CSS
-   **Development**: Node.js

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

-   [Node.js](https://nodejs.org/en/) (v18 or later recommended)
-   [MetaMask](https://metamask.io/) browser extension

## Getting Started

Follow these steps to set up and run the project on your local machine.

### 1. Clone & Install Dependencies

First, clone the repository (if you haven't already) and install the necessary dependencies for both the root project and the frontend.

```bash
# Clone the repository
git clone <repository-url>
cd <project-directory>

# Install root dependencies (Hardhat, Ethers, etc.)
npm install

# Navigate to the frontend directory and install its dependencies
cd frontend
npm install
cd ..
```

### 2. Run the Local Blockchain

Open a new terminal and start the local Hardhat blockchain node. This will create a local Ethereum network with 20 pre-funded test accounts.

```bash
npx hardhat node
```
Keep this terminal window running.

### 3. Compile and Deploy the Smart Contract

Open a second terminal. From the project's root directory, compile the smart contract and then deploy it to your local Hardhat node.

```bash
# Compile the contract (this also copies the ABI to the frontend)
npx hardhat compile

# Deploy the contract (this creates the contract-address.json file for the frontend)
npx hardhat run scripts/deploy.js --network localhost
```

### 4. Run the Frontend Application

Open a third terminal. Navigate to the `frontend` directory and start the React development server.

```bash
cd frontend
npm start
```
Your browser should automatically open to `http://localhost:3000`, where you will see the dApp running.

## MetaMask Configuration

To interact with the dApp, you need to configure your MetaMask wallet to connect to your local Hardhat network and use one of the funded test accounts.

### 1. Add the Hardhat Network

-   Open MetaMask and click on the network selection dropdown (usually in the top-left).
-   Select **"Add network"**, then **"Add a network manually"**.
-   Fill in the details:
    -   **Network Name:** `Hardhat Localhost`
    -   **New RPC URL:** `http://127.0.0.1:8545`
    -   **Chain ID:** `31337`
    -   **Currency Symbol:** `ETH`
-   Click **Save**.

### 2. Import a Funded Account

-   In the terminal window where `npx hardhat node` is running, copy the **Private Key** for `Account #0`.
-   In MetaMask, click the account selection dropdown (top-center) and choose **"Add account or hardware wallet"**.
-   Select **"Private Key"** from the options.
-   Paste the copied private key and click **Import**.

You will now have an account with 10,000 test ETH, ready to use with the dApp. Make sure both the **Hardhat Localhost** network and your **imported account** are selected in MetaMask before using the app.

## Project Structure

```
/
├── contracts/      # Solidity smart contracts
│   └── Counter.sol
├── frontend/       # React frontend application
│   ├── public/
│   └── src/
│       ├── App.js              # Main application component
│       ├── App.css             # Styles for the app
│       └── contract-address.json # Auto-generated contract data
├── ignition/       # Hardhat Ignition deployment scripts
├── scripts/        # Deployment and interaction scripts
│   ├── deploy.js
│   └── interact.js
├── test/           # Test files for contracts
├── hardhat.config.js # Hardhat configuration
└── package.json    # Project dependencies and scripts
```
