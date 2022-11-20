import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyERC20.json';

const ERC20VOTES_TOKEN_ADDRESS = '0x324C938062235E86DBF068AC2EDE9211FE5F842F';

export class CreatePaymentOrderDto {
  value: number;
  secret: string;
}

export class RequestPaymentOrderDto {
  id: number;
  secret: string;
  receiver: string;
}

export class PaymentOrder {
  value: number;
  id: number;
  secret: string;
}

@Injectable()
export class AppService {
  provider: ethers.providers.BaseProvider;
  erc20ContractFactory: ethers.ContractFactory;

  paymentOrders: PaymentOrder[];
  erc20Contract: ethers.Contract;

  constructor() {
    this.provider = ethers.getDefaultProvider('goerli');
    this.erc20ContractFactory = new ethers.ContractFactory(
      tokenJson.abi,
      tokenJson.bytecode,
    );

    this.paymentOrders = [];
    this.erc20Contract = this.erc20ContractFactory.attach(
      ERC20VOTES_TOKEN_ADDRESS,
    );
    // const signer = ethers.Wallet.fromMnemonic(process.env.MNEMONIC);
  }

  getTokenAddress() {
    return ERC20VOTES_TOKEN_ADDRESS;
  }

  requestTokens() {
    return true;
  }

  getLastBlock(blockNumberOrTag = 'latest'): Promise<ethers.providers.Block> {
    return this.provider.getBlock(blockNumberOrTag);
  }

  async getTotalSupply(address: string): Promise<number>{
    const contractInstance = this.erc20ContractFactory
      .attach(address)
      .connect(this.provider);
    const totalSupply = await contractInstance.totalSupply();
    return parseFloat(ethers.utils.formatEther(totalSupply));
  }

  async getAllowance(
    contractAddress: string,
    from: string,
    to: string,
  ): Promise<number> {
    const contractInstance = this.erc20ContractFactory
      .attach(contractAddress)
      .connect(this.provider);
    const allowance = await contractInstance.allowance(from, to);
    return parseFloat(ethers.utils.formatEther(allowance));
  }

  getPaymentOrder(id: number) {
    const paymentOrder = this.paymentOrders[id];
    return { value: paymentOrder.value, id: paymentOrder.id };
  }

  createPaymentOrder(value: number, secret: string) {
    const newPaymentOrder = new PaymentOrder();
    newPaymentOrder.value = value;
    newPaymentOrder.secret = secret;
    newPaymentOrder.id = this.paymentOrders.length;
    this.paymentOrders.push(newPaymentOrder);
    return newPaymentOrder.id;
  }

  async requestPaymentOrder(id: number, secret: string, receiver: string) {
    const paymentOrder = this.paymentOrders[id];
    if (secret != paymentOrder.secret) throw new Error('Wrong secret');
    const signer = ethers.Wallet.createRandom().connect(this.provider);
    const contractInstance = this.erc20ContractFactory
      .attach('addres in your .env file')
      .connect(signer);
    const tx = await contractInstance.mint(receiver, paymentOrder.value);
    return tx.wait();
  }
}
