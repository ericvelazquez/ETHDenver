import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";

const MINT_VALUE = ethers.utils.parseEther("10");

async function main() {
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    const accounts = await ethers.getSigners(); 

    const myTokenFactory = new MyToken__factory(accounts[0]);
    const myTokenContract = myTokenFactory.attach(contractAddress);

    const mintTx = await myTokenContract.mint(accounts[3].address, MINT_VALUE); 
    await mintTx.wait();
    console.log("Minted", MINT_VALUE.toString(), "decimal units to account", accounts[3].address)
    console.log("Minted tx hash: ", mintTx.hash)
    // 0xe104b5426fdc5074b6b0f453bbda764526de884c3a0b5a99d396a8602f955b2f
    const delegateTx = await myTokenContract.connect(accounts[3]).delegate(accounts[3].address)
    await delegateTx.wait();
    // 0xc9a5580aa78ef53fa81aef82e85f00dbbf7310c8bcb1de4b8c9a8a402f040dca
    console.log("Self delegated. Tx hash: ",delegateTx.hash)

    
  }

main().catch((error) => {
    console.error(error)
    process.exit(1)
  })