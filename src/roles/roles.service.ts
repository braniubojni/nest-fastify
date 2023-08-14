import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './roles.model';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleRepo: typeof Role) {}

  async create(dto: CreateRoleDto) {
    const role = await this.roleRepo.create(dto);
    return role;
  }

  async getByValue(value: string) {
    const role = await this.roleRepo.findOne({ where: { value } });
    return role;
  }
}
