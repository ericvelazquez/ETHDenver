import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";


async function main() {
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    const accounts = await ethers.getSigners(); 

    const myTokenFactory = new MyToken__factory(accounts[0]);
    const myTokenContract = myTokenFactory.attach(contractAddress);

    const votes = await myTokenContract.connect(accounts[1]).getVotes(accounts[1].address)


    console.log("Votes", votes?.toString())
  }

main().catch((error) => {
    console.error(error)
    process.exit(1)
  })