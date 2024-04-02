import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CurrentUser } from '../../core/shared/decorators/current-user.decorator';
import { AuthUser } from '../../core/shared/types';
import { CreateWalletDto, TransferDto } from './wallet.dto';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { CreateBillDto } from './common/bills.dto';
import { JwtAuthGuard } from '../../core/shared/guards/jwt-auth.guard';

@Controller('wallet')
@ApiTags('wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService
  ) { }

  // This is strictly for user-service
  @ApiExcludeEndpoint()
  @Post()
  async createWallet(@Body() dto: CreateWalletDto) {
    const wallet = await this.walletService.createWallet(dto);

    return wallet.toDto();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async getWalletByUserId(@Param('userId', ParseUUIDPipe) id: string) {
    const wallet = await this.walletService.findByUserId(id);
    return wallet.toDto()
  }


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('transfer')
  async transfer(@Body() dto: TransferDto, @CurrentUser() user: AuthUser) {
    const transaction = await this.walletService.transfer({ ...dto, userId: user.id });
    return transaction.toDto();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('payBill')
  async payBill(@Body() dto: CreateBillDto, @CurrentUser() user: AuthUser) {
    const bill = await this.walletService.payBill({ ...dto, userId: user.id });
    return bill.toDto();
  }
}
