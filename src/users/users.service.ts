import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.to';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepo: typeof User) {}
  async create(dto: CreateUserDto) {
    const user = await this.userRepo.create(dto);
    return user;
  }

  async getAll() {
    const users = await this.userRepo.findAll();
    return users;
  }
}
