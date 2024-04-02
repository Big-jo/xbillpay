import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { AbstractDto } from "../../core/shared/abstract.dto";
import { UserEntity } from "./user.entity";
import { IsEmail, IsString } from "class-validator";
import { IsValidPassword, IsValidPhoneNumber } from "../../core/shared/decorators/custom-validators";

export class UserResponseDto extends AbstractDto {
  @ApiProperty({
    description: 'User agent first name',
    example: 'John'
  })
  firstName: string;

  @ApiProperty({
    description: 'User agent last name',
    example: 'Doe'
  })
  lastName: string;

  @ApiProperty({
    description: 'User agent full name',
    example: 'John Doe'
  })
  fullName: string;

  @ApiProperty({
    description: 'User agent email',
    example: 'johndoe@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'User agent account state',
    example: false
  })
  isActive: boolean;

  @ApiProperty({
    description: 'User agent phone number',
    example: '08012345678'
  })
  phone: string;

  @ApiProperty({
    description: 'User agent creation date',
    example: '2021-10-10T10:00:00Z'
  })
  createdAt: Date;

  constructor(entity: UserEntity) {
    super(entity);
    this.firstName = entity.firstName;
    this.lastName = entity.lastName;
    this.fullName = entity.fullName;
    this.email = entity.email;
    this.isActive = entity.isActive;
    this.phone = entity.phone;
    this.createdAt = entity.createdAt;
  }
}

export class CreateUserDto {
  @ApiProperty({
    description: 'User agent first name',
    example: 'John'
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'User agent last name',
    example: 'Doe'
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'User agent email',
    example: 'johndoegmail.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User agent password',
    example: 'password'
  })
  @IsValidPassword()
  password: string;

  @ApiProperty({
    description: 'User agent phone number',
    example: '08012345678'
  })
  @IsValidPhoneNumber()
  phone: string;
}

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password', 'email'])) {
  id: string;
}