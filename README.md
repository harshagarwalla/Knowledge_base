<div align="center">
  <img src="./logo.png" alt="Nero Chain KB Logo" width="200" style="border-radius:20px; box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);"/>
  <br/><br/>
  
  # Nero Chain Knowledge Base 🌌
  **Decentralized, Immutable, Community Governed On-Chain Knowledge.**

  [![Built with Nero](https://img.shields.io/badge/Built_with-Nero_Chain-black?style=flat)](https://nerochain.io/)
  [![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=flat&logo=solidity&logoColor=white)](https://soliditylang.org/)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
  [![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)

</div>

<hr/>

## 🎬 Project Walkthrough

Watch the application in action with our custom 3D Web3 user interface:

![Nero KB Demo Walkthrough](./demo.webp)

*(Click to view, or download `demo.webp` to view the full recorded interaction flow).*

## 🌟 Overview

The **Nero Chain Knowledge Base** is a next-generation decentralized application (dApp) built on the **Nero Chain EVM**. It acts as an immutable wiki where community members can create, curate, and govern informative articles, tutorials, and documentation entirely on-chain. 

Unlike traditional databases, every entry, edit, and upvote is securely cryptographically finalized on the Nero network, ensuring 100% transparency and resistance to censorship.

## 🏗️ System Architecture

The project architecture is bifurcated into a high-performance modern Web3 frontend and a secure smart-contract-driven backend.

### 1. Frontend Layer
- **Framework:** React.js powered by Vite for lightning-fast HMR and build performance.
- **Routing:** Component-based client routing achieved through `react-router-dom`, maintaining seamless SPA experiences.
- **UI/UX Aesthetics:** 
  - Glassmorphic translucent surfaces tailored for the "Web3 Cosmic" theme.
  - Immersive 3D motion and parallax transitions using **GSAP** (`@gsap/react`).
  - Clean vector iconography implemented natively via `lucide-react`.

### 2. State & Blockchain Interaction Layer
- **Wallet Connection:** Real-time seamless MetaMask (EVM) connection.
- **Data Execution:** Utilizing `ethers.js` to construct and sign transactions.
- **RPC Invocation**: Data reading and mutative writes are propagated using endpoints pointing to `https://rpc-testnet.nerochain.io`.

### 3. Smart Contract Backend 
Written natively in Solidity (`KnowledgeBase.sol`), the backend implements the following structural logic points:
- `createArticle`: Initializes standard payload struct (Title, Content, Author).
- `editArticle`: Facilitates mutable modifications tracked securely bounding the payload footprint.
- `upvoteArticle` & `markAnswer`: Enables decentralized community governance of information relevance.
- `listArticles` & `getArticle`: High-efficiency read functions querying the contract directly.

---

## 🚀 Getting Started

To operate this project or run your own instance locally:

### Prerequisites
1. **Node.js** (v18+)
2. **MetaMask Wallet Extension** configured for the Nero Chain Testnet (RPC: `https://rpc-testnet.nerochain.io`, Chain ID: `689`).

### Installation

```bash
# Clone the repository
git clone https://github.com/pratyush06-aec/knowledge-base.git
cd knowledge-base/nero-knowledge-app

# Install package dependencies
npm install

# Compile the Smart Contract
npx hardhat compile

# Deploy the Smart Contract to Nero Chain Testnet
npx hardhat run scripts/deploy.js --network neroTestnet

# Note the deployed contract address and update it in src/lib/nerochain.js 
# (const CONTRACT_ADDRESS = "YOUR_ADDRESS")

# Run the local development server locally
npm run dev
```

Navigate to `http://localhost:5173` to explore the Nero Chain Knowledge Experience!

## 🔐 Contact & Contributions
Feel free to open Issues or Pull Requests on the github if you have an idea to refine the EVM architecture!
