import { ApiProperty } from "@nestjs/swagger";
import { AbstractDto } from "../../../core/shared/abstract.dto";
import { TransactionTypes } from "../../../core/shared/enum";
import { TransactionsEntity } from "./transactions.entity";

export class TransactionsResponseDto extends AbstractDto {
  @ApiProperty({
    description: 'Amount of transaction',
    example: 1000
  })
  amount: number;

  @ApiProperty({
    description: 'Transaction descripption',
    example: 'Payment for goods'
  })
  description: string;

  @ApiProperty({
    description: 'Transaction type',
    example: TransactionTypes.CREDIT
  })
  type: string;

  @ApiProperty({
    description: 'Date of transaction',
    example: '2021-10-10T12:00:00'
  })
  createdAt: Date;

  constructor(entity: TransactionsEntity) {
    super(entity);
    this.amount = entity.amount;
    this.description = entity.description;
    this.type = entity.type;
    this.createdAt = entity.createdAt;
  }

}