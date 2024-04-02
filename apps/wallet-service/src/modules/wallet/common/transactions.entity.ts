import { Column, DeleteDateColumn, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../../core/shared/abstract.entity";
import { TransactionsResponseDto } from "./transactions.dto";
import { WalletEntity } from "../wallet.entity";

@Entity("transactions")
export class TransactionsEntity extends AbstractEntity<TransactionsResponseDto> {

  @ManyToOne(() => WalletEntity, wallet => wallet.transactions, { onDelete: 'CASCADE' })
  wallet: WalletEntity;

  @Column({ type: 'double precision' })
  amount: number;

  @Column({ type: 'uuid', nullable: true })
  recipientWalletId: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  type: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  dtoClass = TransactionsResponseDto;
}