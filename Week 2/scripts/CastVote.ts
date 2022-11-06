import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config()


async function main() {
const contractAddress = process.argv[2] //0x44E29f925dF516e8f27b10296F0bF3DD8F46a235
const proposal = process.argv[3] // integer 
const provider = ethers.getDefaultProvider("goerli") // ethers.getDefaultProvider("goerli", {alchemy: process.env.Alchemy_API_KEY})
const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "")
const signer = wallet.connect(provider)
const balance = await signer.getBalance()
if (balance.lte(0)) throw new Error("I'm too poor")
const ballotContractFactory = new Ballot__factory(signer)
const ballotContract = ballotContractFactory.attach(
    contractAddress
);
const tx = await ballotContract.vote(proposal)
await tx.wait();
console.log("Tx hash: ", tx.hash)
}
  

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});