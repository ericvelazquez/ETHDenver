import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";

const MINT_VALUE = ethers.utils.parseEther("10");

async function main() {
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    0x5FbDB2315678afecb367f032d93F642f64180aa3
    const accounts = await ethers.getSigners(); 

    const myTokenFactory = new MyToken__factory(accounts[0]);
    const myTokenContract = myTokenFactory.attach(contractAddress);

    const transferTx = await myTokenContract.connect(accounts[1]).transfer(accounts[2].address, MINT_VALUE.div(2))
    await transferTx.wait()
    console.log("Account 1 transafered", MINT_VALUE.div(2), "to account 2. Tx hash:", transferTx.hash)
    // 0x39f37aaf8574e899902c7a646c0edc3ad33239eac460672efd41ec21564d256a
  }

main().catch((error) => {
    console.error(error)
    process.exit(1)
  })