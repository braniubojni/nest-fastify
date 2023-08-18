import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { NO_ACCESS, UNAUTH } from 'src/common/constants/variables';
import { ROLES_KEY } from './roles-auth.decorator';
import { Role } from 'src/roles/roles.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRoles) {
        return true;
      }
      const authHeader = req.headers.authorization;
      const [bearer, token] = authHeader.split(' ');
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: UNAUTH });
      }
      const user = this.jwtService.verify(token);
      req.user = user;
      return user.roles.some((role: Role) =>
        requiredRoles.includes(role.value),
      );
    } catch (e) {
      throw new HttpException(NO_ACCESS, HttpStatus.FORBIDDEN);
    }
  }
}
