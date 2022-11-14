import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config()


async function main() {
  const contractAddress = "0xD8Be4Cefbf1797e2dFc8d04BFB0b463B541Afff6"
  const addressToDelegate = "0x4933eF805602F6FA6Cf4f3263510c95d30912D69"
  const provider = ethers.getDefaultProvider("goerli", {alchemy: process.env.ALCHEMY_API_KEY});
  const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "")
  const signer = wallet.connect(provider)
  const balance = await signer.getBalance()
  if (balance.lte(0)) throw new Error("I'm too poor")
  const ballotContractFactory = new Ballot__factory(signer)
  const ballotContract = ballotContractFactory.attach(
      contractAddress
  );
  const tx = await ballotContract.delegate(addressToDelegate)
  await tx.wait();
  console.log("Tx hash: ", tx.hash)
}
  

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});