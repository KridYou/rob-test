import { IsString, IsInt, MinLength, MaxLength } from 'class-validator';
import { Role } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({example: 'KridYou'})
  @IsString()
  username: string;

  @ApiProperty({example: 'P@ssWord123!'})
  @IsString()
  password: string;

  @ApiProperty({example: Role.ADMIN})
  @IsString()
  role: Role;
}
