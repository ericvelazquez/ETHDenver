import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config()


async function main() {
  const contractAddress = "0xD8Be4Cefbf1797e2dFc8d04BFB0b463B541Afff6"
  const provider = ethers.getDefaultProvider("goerli", {alchemy: process.env.ALCHEMY_API_KEY});
  const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "")
  const signer = wallet.connect(provider)
  const balance = await signer.getBalance()
  if (balance.lte(0)) throw new Error("I'm too poor")
  const ballotContractFactory = new Ballot__factory(signer)
  const ballotContract = ballotContractFactory.attach(
      contractAddress
  );
  const winner = await ballotContract.winnerName()
  const votes = await ballotContract.winningProposal();
  console.log("The winning proposal is: ", ethers.utils.parseBytes32String(winner))
  console.log("The winning proposal has the following # of votes: ", votes);
}
  

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});