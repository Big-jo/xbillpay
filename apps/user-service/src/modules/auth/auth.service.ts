import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthDto } from './auth.dto';
import { comparePasswords } from '../../core/shared/util/password.util';
import { JwtService } from '@nestjs/jwt';
import { AuthUser } from '../../core/shared/types';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService,
    private readonly jwtService: JwtService) { }

  async auth(dto: AuthDto) {
    const user = await this.userService.findByEmailOrPhone(dto.email, dto.phoneNumber);

    const isValid = user && await comparePasswords(dto.password, user.password);

    if (!isValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = {
      id: user.id,
      name: user.fullName,
      email: user.email
    } as AuthUser;

    const token = this.jwtService.sign(payload)

    return {
      accessToken: token,
      user: user.toDto()
    }
  }
}
