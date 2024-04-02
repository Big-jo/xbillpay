import { ApiProperty } from "@nestjs/swagger";
import { AbstractDto } from "../../../core/shared/abstract.dto";
import { Bills } from "../../../core/shared/enum";
import { BillsEntity } from "./bills.entity";
import { IsEnum, IsNumber, IsObject, IsPositive } from "class-validator";
import { IsValidPhoneNumber } from "../../../core/shared/decorators/custom-validators";

export class BillsResponseDto extends AbstractDto {
  @ApiProperty({
    description: 'The type of bill',
    enum: Bills
  })
  billType: string;

  @ApiProperty({
    description: 'The amount of the bill',
    example: 1000
  })
  amount: number;

  @ApiProperty({
    description: 'The recipient phone number',
    example: '08012345678'
  })
  recipientPhone: string;

  @ApiProperty({
    description: 'Any additional data about the bill',
    example: {
      "service": "ikeja-electric",
      "meterNumber": "1234567890"
    }
  })
  metaData: Record<string, any>;

  @ApiProperty({
    description: 'The date the bill was created',
    example: '2021-09-09T00:00:00.000Z'
  })
  createdAt: Date;

  constructor(entity: BillsEntity) {
    super(entity);
    this.billType = entity.billType;
    this.amount = entity.amount;
    this.recipientPhone = entity.recipientPhone;
    this.metaData = JSON.parse(entity.metaData);
    this.createdAt = entity.createdAt;
  }
}

export class CreateBillDto {
  userId: string;

  @ApiProperty({
    description: 'The type of bill',
    enum: Bills
  })
  @IsEnum(Bills)
  billType: string;

  @ApiProperty({
    description: 'The amount of the bill',
    example: 1000
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'The recipient phone number',
    example: '08012345678'
  })
  @IsValidPhoneNumber()
  recipientPhone: string;

  @ApiProperty({
    description: 'Any additional data about the bill',
    example: {
      "service": "ikeja-electric",
      "meterNumber": "1234567890"
    }
  })
  @IsObject()
  metaData: Record<string, any>;
}