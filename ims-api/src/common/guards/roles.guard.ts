import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../constants/metadata.constants';
import { CompanyRole } from '../enums/company-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<CompanyRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles?.length) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user?.role) {
      throw new ForbiddenException('Insufficient permissions');
    }

    const effectiveRoles = new Set(requiredRoles);
    if (requiredRoles.includes(CompanyRole.MANAGER)) {
      effectiveRoles.add(CompanyRole.OWNER);
    }
    if (requiredRoles.includes(CompanyRole.OWNER)) {
      effectiveRoles.add(CompanyRole.OWNER);
    }

    return effectiveRoles.has(user.role);
  }
}
