import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Controller('user')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);

    return user.toDto();
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.userService.findById(id);

    return user.toDto();
  }

  @Get()
  async findAll() {
    const users = await this.userService.findAll();

    return users.map((user) => user?.toDto());
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserDto) {
    const user = await this.userService.update({ id, ...dto });

    return user.toDto();
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.userService.delete(id);
    return { message: 'User deleted successfully' }
  }
}
