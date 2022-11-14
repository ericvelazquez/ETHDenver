import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";


const MINT_VALUE = ethers.utils.parseEther("10")

async function main() {
  const accounts = await ethers.getSigners()

  // Deploy the contract
  const factory = new MyToken__factory(accounts[0])
  const contract = await factory.deploy()
  await contract.deployed()
  console.log("Token contract deployedt at", contract.address)

  // Mint some tokends
  const mintTx = await contract.mint(accounts[1].address, MINT_VALUE)
  await mintTx.wait()
  console.log("Minted", MINT_VALUE.toString(), "decimal units to account", accounts[1].address)
  const balanceBN = await contract.balanceOf(accounts[1].address)
  console.log("Account", accounts[1].address, "has", balanceBN.toString(), "of balance")

  // // Check the voting power
  const votes = await contract.getVotes(accounts[1].address)
  console.log("Account", accounts[1].address, "has", votes.toString(), "units of voting power")

  // Self delegate
  const delegateTx = await contract.connect(accounts[1]).delegate(accounts[1].address)
  await delegateTx.wait()

  const transferTx = await contract.connect(accounts[1]).transfer(accounts[2].address, MINT_VALUE.div(2))
  await transferTx.wait()

  // // Check the voting power
  const votes1After = await contract.getVotes(accounts[1].address)
  console.log("Account", accounts[1].address, "has", votes1After.toString(), "units of voting power after delegating")

  // Self delegate
  const delegateTx2 = await contract.connect(accounts[2]).delegate(accounts[2].address)
  await delegateTx2.wait()

  // Check the voting power
  const votes2After = await contract.getVotes(accounts[2].address)
  console.log("Account", accounts[2].address, "has", votes2After.toString(), "units of voting power after delegating")


  // Check voting power in previous block
  const lastBlock = await ethers.provider.getBlock("latest")
  console.log('Last Block', lastBlock.number);
  const pastVotes = await contract.getPastVotes(accounts[1].address, lastBlock.number - 2)

  console.log("Account", accounts[1].address, "had", pastVotes.toString(), "units of voting power in last block")




}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
