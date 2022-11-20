import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {ethers} from 'ethers';
import tokenJson from '../assets/MyERC20.json';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  wallet: ethers.Wallet | undefined;
  provider: ethers.providers.BaseProvider | undefined

  etherBalance: number | undefined;
  tokenBalance: number | undefined;
  votePower: number | undefined;
  tokenContract: ethers.Contract | undefined;
  tokenContractAddress: string | undefined;

  constructor(private http: HttpClient) {
    this.http.get<any>("http://localhost:3000/token-address").subscribe((ans) => {
      this.tokenContractAddress = ans.result;
    })
  }
 
  createWallet() {
    this.provider = ethers.providers.getDefaultProvider("goerli");
    this.wallet = ethers.Wallet.createRandom().connect(this.provider);
    if(this.tokenContractAddress){
      this.tokenContract = new ethers.Contract(this.tokenContractAddress, tokenJson.abi, this.wallet)
      this.wallet.getBalance().then((balanceBn) => {
        this.etherBalance = parseFloat(ethers.utils.formatEther(balanceBn))
      });
  
      this.tokenContract["balanceOf"](this.wallet.address).then((tokenBalanceBn: ethers.BigNumberish) =>{
        this.tokenBalance = parseFloat(ethers.utils.formatEther(tokenBalanceBn))
      })
  
      this.tokenContract["getVotes"](this.wallet.address).then((votePowerBn: ethers.BigNumberish) =>{
        this.votePower = parseFloat(ethers.utils.formatEther(votePowerBn))
      })
    }
   
  }
}
