import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config()


function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
}

async function main() {
console.log("Deploying Ballot contract");
console.log("Proposals: ");
const contractAddress = process.argv[2] //0x44E29f925dF516e8f27b10296F0bF3DD8F46a235
const targetAddress = process.argv[3]
const provider = ethers.getDefaultProvider("goerli") // ethers.getDefaultProvider("goerli", {alchemy: process.env.Alchemy_API_KEY})
const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "")
const signer = wallet.connect(provider)
const balance = await signer.getBalance()
console.log('balance: ', balance);
if (balance.lte(0)) throw new Error("I'm too poor")
const ballotContractFactory = new Ballot__factory(signer)
const ballotContract = ballotContractFactory.attach(
    contractAddress
);
const tx = await ballotContract.giveRightToVote(targetAddress)
await tx.wait();
console.log("Tx hash: ", tx.hash)
}
  

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});