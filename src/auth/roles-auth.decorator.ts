import { SetMetadata } from '@nestjs/common';

const ROLES_KEY = 'roles';

const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

export { Roles, ROLES_KEY };
