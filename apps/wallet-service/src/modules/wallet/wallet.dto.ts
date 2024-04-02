import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AbstractDto } from "../../core/shared/abstract.dto";
import { TransactionsResponseDto } from "./common/transactions.dto";
import { WalletEntity } from "./wallet.entity";
import { IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";
import { BillsResponseDto } from "./common/bills.dto";

export class WalletResponseDto extends AbstractDto {
  @ApiProperty({
    description: 'Wallet balance',
    example: 0
  })
  balance: number;

  @ApiProperty({
    description: 'Wallet Transactions',
    type: TransactionsResponseDto,
    isArray: true
  })
  transactions: TransactionsResponseDto[];

  @ApiProperty({
    description: 'Wallet Bills',
    type: BillsResponseDto,
    isArray: true
  })
  bills: BillsResponseDto[];

  constructor(entity: WalletEntity) {
    super(entity);
    this.balance = entity.balance;
    this.transactions = entity.transactions?.map(transaction => transaction.toDto());
    this.bills = entity.bills?.map(bill => bill.toDto());
  }
}

export class CreateWalletDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  userId: string;
}

export class TransferDto {
  userId: string;

  @ApiProperty({
    description: 'Amount to transfer',
    example: 100
  })
  @IsPositive()
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({
    description: 'Description of the transaction',
    example: 'Payment for goods'
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'User ID of the recipient',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  recipientWalletId: string;
}