import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { UsersService } from './users.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { BanUserDto } from './dto/ban-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userService.create(userDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: HttpStatus.OK, type: [User] })
  @Get()
  // @UseGuards(JwtAuthGuard) // Checking for user login
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  getAll() {
    return this.userService.getAll();
  }

  // Only admins are able to assign the role
  @ApiOperation({ summary: 'Assign the role' })
  @ApiResponse({ status: HttpStatus.OK })
  @Post('/role')
  // @UseGuards(JwtAuthGuard) // Checking for user login
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  assignRole(@Body() roleDto: AssignRoleDto) {
    return this.userService.assignRole(roleDto);
  }

  // Only admins are able to assign the role
  @ApiOperation({ summary: 'Ban user' })
  @ApiResponse({ status: HttpStatus.OK })
  @Post('/ban')
  // @UseGuards(JwtAuthGuard) // Checking for user login
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  banUser(@Body() banDto: BanUserDto) {
    return this.userService.ban(banDto);
  }
}
