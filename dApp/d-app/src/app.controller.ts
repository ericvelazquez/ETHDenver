import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ethers } from 'ethers';
import { AppService, CreatePaymentOrderDto, PaymentOrder, RequestPaymentOrderDto } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('lastBlock')
  getLastBlock(): Promise<ethers.providers.Block> {
    return this.appService.getLastBlock();
  }

  @Get('block/:hash')
  getBlock(@Param('hash') hash: string): Promise<ethers.providers.Block> {
    return this.appService.getLastBlock(hash);
  }

  @Get('total-supply/:address')
  getTotalSupply(@Param('address') address: string): Promise<number> {
    return this.appService.getTotalSupply(address);
  }

  @Get('allowance/:address')
  getAllowance(
    @Query('address') address: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<number> {
    return this.appService.getAllowance(address, from, to);
  }

  @Get('payment-order/:id')
  getPaymentOrder(@Param('id') id: number): any {
    return this.appService.getPaymentOrder(id);
  }

  @Post('payment-order')
  createPaymentOrder(@Body() body: CreatePaymentOrderDto): number {
    return this.appService.createPaymentOrder(body.value, body.secret);
  }

  @Post('request-payment')
  requestPayment(@Body() body: RequestPaymentOrderDto): Promise<any> {
    return this.appService.requestPaymentOrder(
      body.id,
      body.secret,
      body.receiver,
    );
  }

  @Get('token-address')
  getTokenAddress() {
    return { result: this.appService.getTokenAddress() };
  }

  @Post('request-tokens')
  requestTokens(): any {
    return this.appService.requestTokens();
  }
}
