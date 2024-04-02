import { Column, DeleteDateColumn, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../../core/shared/abstract.entity";
import { BillsResponseDto } from "./bills.dto";
import { WalletEntity } from "../wallet.entity";

@Entity('bills')
export class BillsEntity extends AbstractEntity<BillsResponseDto> {
  @ManyToOne(() => WalletEntity, wallet => wallet.bills, {
    onDelete: 'CASCADE',
    cascade: ['soft-remove']
  })
  wallet: WalletEntity;

  @Column()
  billType: string;

  @Column({ type: 'double precision', precision: 8, scale: 3 })
  amount: number;

  @Column()
  recipientPhone: string;

  // Tracks some more data about whatever type of bill
  @Column({ type: 'simple-json' })
  metaData: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  dtoClass = BillsResponseDto;
}