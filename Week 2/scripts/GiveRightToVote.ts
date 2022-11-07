import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config()


async function main() {
  const contractAddress = "0xD8Be4Cefbf1797e2dFc8d04BFB0b463B541Afff6"
  const targetAddress = "0x2924a6C59115299A5945cA1dF6D73ABA526C97bd"
  const provider = ethers.getDefaultProvider("goerli", {alchemy: process.env.ALCHEMY_API_KEY});
  const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "")
  const signer = wallet.connect(provider)
  console.log(`Connected to the wallet ${signer.address}`);
  const balance = await signer.getBalance()
  if (balance.lte(0)) throw new Error("I'm too poor")
  console.log("balance : ", balance.toString())
  const ballotContractFactory = new Ballot__factory(signer)
  const ballotContract = ballotContractFactory.attach(
      contractAddress
  )
  const tx = await ballotContract.giveRightToVote(targetAddress)
  await tx.wait();
  console.log("Tx hash: ", tx.hash)
}
  

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});