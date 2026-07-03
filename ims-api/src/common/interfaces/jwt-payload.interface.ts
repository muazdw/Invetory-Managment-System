import { CompanyRole } from '../enums/company-role.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  companyId?: string;
  role?: CompanyRole;
}
