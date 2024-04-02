import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional } from "class-validator";
import { IsValidPassword, IsValidPhoneNumber } from "../../core/shared/decorators/custom-validators";

export class AuthDto {
  @ApiPropertyOptional({
    description: 'User agent email',
    example: 'johndoe@gmail.com'
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User agent password',
    example: '5ampleP@ssword'
  })
  @IsValidPassword()
  password: string;

  @ApiPropertyOptional({
    description: 'User agent phone number',
    example: '08012345678'
  })
  @IsOptional()
  @IsValidPhoneNumber()
  phoneNumber: string;
}