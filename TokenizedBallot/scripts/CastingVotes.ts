import { ethers } from "hardhat";
import { TokenizedBallot__factory } from "../typechain-types";


async function main() {
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    const accounts = await ethers.getSigners(); 

    const myTokenFactory = new TokenizedBallot__factory(accounts[0]);
    const myTokenContract = myTokenFactory.attach(contractAddress);

    const voteTx = await myTokenContract.connect(accounts[1]).vote(1, ethers.utils.parseEther("1"))
    await voteTx.wait()

    console.log("Vote tx:", voteTx.hash)
    // 0xd87e6e32da0ed6b69fc575babe7495ffe6bb1a8d38002d7034a55d3b1855a07c
  }

main().catch((error) => {
    console.error(error)
    process.exit(1)
  })