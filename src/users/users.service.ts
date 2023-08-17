import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.to';
import { RolesService } from 'src/roles/roles.service';
import { UtilsService } from 'src/utils/utils.service';
import { Role } from 'src/roles/roles.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepo: typeof User,
    private roleService: RolesService,
    private utilsService: UtilsService,
  ) {}
  async create(dto: CreateUserDto) {
    const [user, role] = (await this.utilsService.allSettled([
      this.userRepo.create(dto),
      this.roleService.getByValue('USER'),
    ])) as [User, Role];
    await user.$set('roles', [role.id]);

    return user;
  }

  async getAll() {
    const users = await this.userRepo.findAll();
    return users;
  }
}
