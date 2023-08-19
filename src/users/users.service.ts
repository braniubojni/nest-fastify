import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from 'src/roles/roles.service';
import { UtilsService } from 'src/utils/utils.service';
import { Role } from 'src/roles/roles.model';
import { AssignRoleDto } from './dto/assign-role.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { ROLE_OR_USER_NOT_FOUND } from 'src/common/constants/variables';
import { NOT_FOUND } from 'src/common/constants/functions';
import { APP_MODULES } from 'src/common/constants/enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepo: typeof User,
    private roleService: RolesService,
    private utilsService: UtilsService,
  ) {}
  private getUserAndRole(id: number, value: string): Promise<[User, Role]> {
    return this.utilsService.allSettled([
      this.userRepo.findByPk(id),
      this.roleService.getByValue(value),
    ]) as Promise<[User, Role]>;
  }

  async create(dto: CreateUserDto) {
    const [user, role] = (await this.utilsService.allSettled([
      this.userRepo.create(dto),
      this.roleService.getByValue('USER'),
    ])) as [User, Role];
    await user.$set('roles', [role.id]);
    user.roles = [role];

    return user;
  }

  async getAll() {
    const users = await this.userRepo.findAll({ include: { all: true } });
    return users;
  }

  async getByEmail(email: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }

  async assignRole(roleDto: AssignRoleDto) {
    const [user, role] = await this.getUserAndRole(
      roleDto.userId,
      roleDto.value,
    );
    if (user && role) {
      await user.$add(APP_MODULES.ROLE, role.id);
      return roleDto;
    }
    throw new HttpException(ROLE_OR_USER_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  async ban(banDto: BanUserDto) {
    const user = await this.userRepo.findByPk(banDto.userId);
    if (!user) {
      throw new HttpException(
        NOT_FOUND(APP_MODULES._USER),
        HttpStatus.NOT_FOUND,
      );
    }
    user.banned = true;
    user.banReason = banDto.banReason;
    await user.save();
    return user;
  }
}
