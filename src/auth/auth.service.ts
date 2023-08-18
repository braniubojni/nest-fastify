import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ALREADY_EXISTS } from 'src/common/constants/functions';
import { CreateUserDto } from 'src/users/dto/create-user.to';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/users.model';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  private async validateUser(userDto: CreateUserDto): Promise<User> {
    const user = await this.userService.getByEmail(userDto.email);

    const isPassEqual = user
      ? await bcrypt.compare(userDto.password, user.password)
      : null;
    if (isPassEqual) return user;

    throw new UnauthorizedException({ message: 'Incorrect credentials' });
  }

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);

    return this.generateToken(user);
  }

  async registration(userDto: CreateUserDto) {
    const userExist = await this.userService.getByEmail(userDto.email);
    if (userExist) {
      throw new HttpException(ALREADY_EXISTS`user`, HttpStatus.CONFLICT);
    }
    const hashPass = await bcrypt.hash(userDto.password, 10);
    const user = await this.userService.create({
      ...userDto,
      password: hashPass,
    });
    return this.generateToken(user);
  }

  async generateToken(user: User) {
    const payload = { email: user.email, id: user.id, roles: user.roles };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
