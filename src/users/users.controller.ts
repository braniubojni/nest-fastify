import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.to';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userService.create(userDto);
  }

  @Get()
  getAll() {
    throw Error('Runtime Issue here');

    return this.userService.getAll();
  }
}
