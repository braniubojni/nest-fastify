import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
import { INVALID } from 'src/common/constants/functions';
import { REQUIRED_LEN, SHOULD_BE_STRING } from 'src/common/constants/variables';

export class CreateUserDto {
  @ApiProperty({ example: 'someUser@gmail.com', description: 'Valid email' })
  @IsString({ message: SHOULD_BE_STRING })
  @IsEmail({}, { message: INVALID('email') })
  readonly email: string;

  @ApiProperty({ example: 'Qwerty987@', description: 'Password' })
  @IsString({ message: SHOULD_BE_STRING })
  @Length(8, 30, { message: REQUIRED_LEN })
  readonly password: string;
}
