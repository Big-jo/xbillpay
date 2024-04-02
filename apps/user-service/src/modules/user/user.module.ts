import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    HttpModule
  ],
  exports: [UserService]
})
export class UserModule { }
