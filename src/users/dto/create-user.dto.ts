import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'someUser@gmail.com', description: 'Valid email' })
  readonly email: string;

  @ApiProperty({ example: 'Qwerty987@', description: 'Password' })
  readonly password: string;
}
