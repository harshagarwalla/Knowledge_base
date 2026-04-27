import "@nomicfoundation/hardhat-toolbox";

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: "0.8.24",
  networks: {
    neroTestnet: {
      url: "https://rpc-testnet.nerochain.io",
      chainId: 689,
      accounts: ["0x51c37f0932c5dec1b667c5645b619294c8682194959ef835851d47eaef7ecbcd"]
    }
  }
};
