import { BeforeInsert, Column, Entity, Index, UpdateDateColumn } from "typeorm";
import { AbstractEntity } from "../../core/shared/abstract.entity";
import { UserResponseDto } from "./user.dto";

@Entity('users')

export class UserEntity extends AbstractEntity<UserResponseDto> {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  fullName: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  phone: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  dtoClass = UserResponseDto;

  @BeforeInsert()
  insertFullName() {
    this.fullName = `${this.firstName} ${this.lastName}`
  }
}
