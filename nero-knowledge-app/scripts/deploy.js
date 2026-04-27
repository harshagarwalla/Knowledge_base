import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer ? deployer.address : "local node");

  const KnowledgeBase = await hre.ethers.getContractFactory("KnowledgeBase");
  const knowledgeBase = await KnowledgeBase.deploy();

  await knowledgeBase.waitForDeployment();

  const address = await knowledgeBase.getAddress();
  console.log("KnowledgeBase deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
