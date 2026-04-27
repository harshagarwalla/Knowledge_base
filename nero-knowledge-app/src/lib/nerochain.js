import { ethers } from "ethers";

// ABI for the KnowledgeBase contract
const contractABI = [
    "function createArticle(string memory _id, string memory _title, string memory _content, string memory _category, string memory _tags) public",
    "function editArticle(string memory _id, string memory _newContent) public",
    "function upvoteArticle(string memory _id) public",
    "function markAnswer(string memory _id) public",
    "function archiveArticle(string memory _id) public",
    "function getArticle(string memory _id) public view returns (tuple(string id, address author, string title, string content, string category, string tags, uint256 upvotes, bool isAnswer, bool isArchived))",
    "function getArticleCount() public view returns (uint256)",
    "function listArticles() public view returns (tuple(string id, address author, string title, string content, string category, string tags, uint256 upvotes, bool isAnswer, bool isArchived)[])",
    "event ArticleCreated(string id, address author, string title)"
];

// NOTE: Replace with your deployed contract address on Nero Chain Testnet
const CONTRACT_ADDRESS = "0xc120d49b97b88720F78d0B40E6fB2Ad04cC164d1";

let provider;
let signer;
let contract;

export async function checkConnection() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            provider = new ethers.BrowserProvider(window.ethereum);
            signer = await provider.getSigner();
            contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
            return { publicKey: await signer.getAddress() };
        } catch (error) {
            console.error("User rejected request or error occurred", error);
            return null;
        }
    } else {
        throw new Error("MetaMask or other Web3 wallet is not installed.");
    }
}

export async function createArticle({ id, title, content, category, tags }) {
    if (!contract) throw new Error("Wallet not connected");
    const tx = await contract.createArticle(id, title, content, category, tags);
    const receipt = await tx.wait();
    return { status: "Success", transactionHash: receipt.hash };
}

export async function editArticle({ id, newContent }) {
    if (!contract) throw new Error("Wallet not connected");
    const tx = await contract.editArticle(id, newContent);
    const receipt = await tx.wait();
    return { status: "Success", transactionHash: receipt.hash };
}

export async function upvoteArticle({ id }) {
    if (!contract) throw new Error("Wallet not connected");
    const tx = await contract.upvoteArticle(id);
    const receipt = await tx.wait();
    return { status: "Success", transactionHash: receipt.hash };
}

export async function markAnswer({ id }) {
    if (!contract) throw new Error("Wallet not connected");
    const tx = await contract.markAnswer(id);
    const receipt = await tx.wait();
    return { status: "Success", transactionHash: receipt.hash };
}

export async function archiveArticle({ id }) {
    if (!contract) throw new Error("Wallet not connected");
    const tx = await contract.archiveArticle(id);
    const receipt = await tx.wait();
    return { status: "Success", transactionHash: receipt.hash };
}

export async function getArticle(id) {
    if (!contract) throw new Error("Wallet not connected");
    const article = await contract.getArticle(id);
    return {
        id: article.id,
        author: article.author,
        title: article.title,
        content: article.content,
        category: article.category,
        tags: article.tags,
        upvotes: Number(article.upvotes),
        isAnswer: article.isAnswer,
        isArchived: article.isArchived
    };
}

export async function listArticles() {
    if (!contract) throw new Error("Wallet not connected");
    const articles = await contract.listArticles();
    return articles.map(article => ({
        id: article.id,
        author: article.author,
        title: article.title,
        content: article.content,
        category: article.category,
        tags: article.tags,
        upvotes: Number(article.upvotes),
        isAnswer: article.isAnswer,
        isArchived: article.isArchived
    }));
}

export async function getArticleCount() {
    if (!contract) throw new Error("Wallet not connected");
    const count = await contract.getArticleCount();
    return Number(count);
}
