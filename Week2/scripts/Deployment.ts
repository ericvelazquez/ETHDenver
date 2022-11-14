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
  const proposals = ["Cookie", "Vanilla", "Chocolate"]
  proposals.forEach((element, index) => {
      console.log(`Proposal N. ${index + 1}: ${element}`);
  });

  const provider = ethers.getDefaultProvider("goerli", {alchemy: process.env.ALCHEMY_API_KEY});
  const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "")
  const signer = wallet.connect(provider)
  const balance = await signer.getBalance()
  console.log('balance: ', balance);
  if (balance.lte(0)) throw new Error("I'm too poor")
  const ballotContractFactory = new Ballot__factory(signer)
  const ballotContract = await ballotContractFactory.deploy(
      convertStringArrayToBytes32(proposals)
  );
  await ballotContract.deployed();
  console.log("Ballot deployet at ", ballotContract.address)
}
  

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});