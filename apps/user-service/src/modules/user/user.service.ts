import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { hashPassword } from '../../core/shared/util/password.util';
import { duplicateErrorHandler } from '../../core/shared/util/duplicate-error-handler.util';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AppConfig } from '../../core/config/app';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private configService: ConfigService, private readonly httpService: HttpService) { }

  async create({ password, ...dto }: CreateUserDto) {
    const hashedPassword = await hashPassword(password);

    const user = this.userRepository.create({ password: hashedPassword, ...dto, id: uuidv4() });

    const config = this.configService.get<AppConfig>('app')

    const newUser = await this.userRepository.manager.transaction(async (trx) => {
      try {
        await this.httpService.axiosRef.post(config.services.wallet.url, {
          userId: user.id
        });

        return await trx.save(user);
      } catch (error) {
        duplicateErrorHandler(error, { nameReplacements: { users: 'email' } })
        console.error(error)
        throw new InternalServerErrorException(error)
      }
    })

    return this.findById(newUser.id);
  }

  async findById(id: string) {
    const user = this.userRepository.findOne({
      where: { id }
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async update(dto: UpdateUserDto) {
    const user = await this.findById(dto.id)

    const updatedUser = await this.userRepository.save({ ...user, ...dto })

    await this.userRepository.save({ ...user, ...dto })
    return this.findById(updatedUser.id)
  }

  async delete(id: string) {
    const user = await this.findById(id)
    await this.userRepository.remove(user)
  }

  async findByEmailOrPhone(email: string, phone: string) {
    return this.userRepository.findOne({
      where: [{ email }, { phone }]
    })

  }
}
