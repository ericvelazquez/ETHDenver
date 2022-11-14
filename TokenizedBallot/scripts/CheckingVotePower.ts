
import { ethers } from "hardhat";
import { TokenizedBallot__factory } from "../typechain-types";


async function main() {
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    const accounts = await ethers.getSigners(); 

    const myTokenFactory = new TokenizedBallot__factory(accounts[0]);
    const myTokenContract = myTokenFactory.attach(contractAddress);

    const votingPower = await myTokenContract.connect(accounts[1]).votingPower(accounts[1].address)

    console.log("Vote tx:", votingPower.toString())
  }

main().catch((error) => {
    console.error(error)
    process.exit(1)
  })