import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "../../core/shared/abstract.entity";
import { WalletResponseDto } from "./wallet.dto";
import { TransactionsEntity } from "./common/transactions.entity";
import { BillsEntity } from "./common/bills.entity";

@Entity("wallet")
export class WalletEntity extends AbstractEntity<WalletResponseDto> {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'double precision', default: 0, precision: 8, scale: 3 })
  balance: number;

  @OneToMany(() => TransactionsEntity, transaction => transaction.wallet)
  transactions: TransactionsEntity[];

  @OneToMany(() => BillsEntity, bill => bill.wallet)
  bills: BillsEntity[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  dtoClass = WalletResponseDto;
}