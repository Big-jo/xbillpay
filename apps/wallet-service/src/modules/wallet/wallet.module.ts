import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsEntity } from './common/transactions.entity';
import { WalletEntity } from './wallet.entity';
import { BillsEntity } from './common/bills.entity';

@Module({
  providers: [WalletService],
  controllers: [WalletController],
  imports: [
    TypeOrmModule.forFeature([WalletEntity, TransactionsEntity, BillsEntity])
  ]
})
export class WalletModule { }
