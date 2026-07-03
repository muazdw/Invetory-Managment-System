import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRE_COMPANY_KEY } from '../constants/metadata.constants';
import { ErrorCode } from '../constants/error-codes.constants';
import { ErrorMessage } from '../constants/error-messages.constants';

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireCompany = this.reflector.getAllAndOverride<boolean>(REQUIRE_COMPANY_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requireCompany) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user?.companyId) {
      throw new ForbiddenException({
        code: ErrorCode.NO_COMPANY,
        message: ErrorMessage[ErrorCode.NO_COMPANY],
      });
    }
    return true;
  }
}
