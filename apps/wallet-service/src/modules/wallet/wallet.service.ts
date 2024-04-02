import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { WalletEntity } from './wallet.entity';
import { CreateWalletDto, TransferDto } from './wallet.dto';
import { duplicateErrorHandler } from '../../core/shared/util/duplicate-error-handler.util';
import { TransactionsEntity } from './common/transactions.entity';
import { CreateBillDto } from './common/bills.dto';
import { BillsEntity } from './common/bills.entity';
import { TransactionTypes } from '../../core/shared/enum';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,
    @InjectRepository(TransactionsEntity)
    private readonly transactionsRepository: Repository<TransactionsEntity>,
    @InjectRepository(BillsEntity)
    private readonly billsRepository: Repository<BillsEntity>
  ) { }

  async createWallet(dto: CreateWalletDto): Promise<WalletEntity> {
    const wallet = this.walletRepository.create(dto)

    try {
      await this.walletRepository.save(wallet);
      return this.findById(wallet.id)
    } catch (error) {
      duplicateErrorHandler(error)
      console.error(error)
    }
  }

  async findById(id: string) {
    const wallet = await this.walletRepository.findOne({
      where: { id },
      relations,
    })

    if (!wallet) {
      throw new NotFoundException('Wallet not found')
    }

    return wallet
  }

  async findByUserId(userId: string) {
    const wallet = await this.walletRepository.findOne({
      where: { userId },
      relations,
    })

    if (!wallet) {
      throw new NotFoundException('Wallet not found')
    }

    return wallet
  }

  async transfer(dto: TransferDto) {
    const senderWalletQuery = this.findByUserId(dto.userId)
    const recipientWalletQuery = this.findById(dto.recipientWalletId)

    const [senderWallet, recipientWallet] = await Promise.all([senderWalletQuery, recipientWalletQuery])

    if (senderWallet.balance < dto.amount) {
      throw new BadRequestException('Insufficient funds')
    }

    senderWallet.balance -= dto.amount
    recipientWallet.balance += dto.amount

    const newSenderTransaction = this.transactionsRepository.create({
      amount: dto.amount,
      description: dto.description,
      type: TransactionTypes.DEBIT,
      wallet: senderWallet
    })

    const newRecipientTransaction = this.transactionsRepository.create({
      amount: dto.amount,
      description: dto.description,
      recipientWalletId: dto.recipientWalletId,
      type: TransactionTypes.CREDIT,
      wallet: recipientWallet
    })

    await this.transactionsRepository.save([newSenderTransaction, newRecipientTransaction])

    return this.findByUserId(dto.userId);
  }

  async payBill(dto: CreateBillDto) {
    const wallet = await this.findByUserId(dto.userId)

    if (wallet.balance < dto.amount) {
      throw new BadRequestException('Insufficient funds')
    }

    wallet.balance -= dto.amount

    const newBill = this.billsRepository.create({
      amount: dto.amount,
      billType: dto.billType,
      metaData: JSON.stringify(dto.metaData),
      recipientPhone: dto.recipientPhone,
      wallet
    })

    await this.billsRepository.save(newBill)

    return this.findByUserId(dto.userId)
  }


}

const relations: FindOptionsRelations<WalletEntity> = {
  transactions: true,
  bills: true,
}