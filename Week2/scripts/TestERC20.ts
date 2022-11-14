import {ethers} from "hardhat"

async function main() {
    const f = await ethers.getContractFactory("MyToken")
    const c = await f.deploy()
    await c.deployed()
    console.log("Contract deployed at ", c.address)
    const [name, symbol, decimals, totalSupply] = await Promise.all([c.name(), c.symbol(), c.decimals(), c.totalSupply()])
    console.log('name, symbol, decimals, totalSupply ', name, symbol, decimals, totalSupply);
    const accounts = await ethers.getSigners()
    const myBalance = await c.balanceOf(accounts[0].address)
    const myBalance1 = await c.balanceOf(accounts[0].address)
    console.log('addres: ',accounts[0].address, '- Balance: ', myBalance.toString());
    console.log('addres: ',accounts[1].address, '- Balance: ', myBalance1.toString());

}

main().catch((err) => {
    console.error(err)
    process.exitCode = -1
})