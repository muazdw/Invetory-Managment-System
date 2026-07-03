import { CompanyRole } from '../enums/company-role.enum';

export interface AuthenticatedUser {
  id: string;
  email: string;
  companyId?: string;
  role?: CompanyRole;
}
