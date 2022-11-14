import { ethers } from "hardhat";
import { TokenizedBallot__factory, MyToken__factory } from "../typechain-types";


function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
  }

async function main() {
  const accounts = await ethers.getSigners()
  const myTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  const proposals = ["Proposal1", "Proposal2", "Proposal3"]
  const bytes32_proposals = convertStringArrayToBytes32(proposals);
  const myTokenFactory = new MyToken__factory(accounts[0]);
  const myTokenContract = myTokenFactory.attach(myTokenAddress);

  // Deploy the contract
  const factory = new TokenizedBallot__factory(accounts[0])
  const lastBlock = await ethers.provider.getBlock("latest");
  const contract = await factory.deploy(bytes32_proposals, myTokenContract.address, lastBlock.number)
  await contract.deployed()
  console.log("Token contract deployedt at", contract.address)

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  