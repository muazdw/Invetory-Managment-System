import { ErrorCode } from './error-codes.constants';

export const ErrorMessage: Record<ErrorCode, string> = {
  [ErrorCode.VALIDATION_ERROR]: 'Validation failed',
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'An unexpected error occurred',

  [ErrorCode.SUPPLIER_NOT_FOUND]: 'Supplier not found',
  [ErrorCode.PRODUCT_NOT_FOUND]: 'Product not found',
  [ErrorCode.INVENTORY_NOT_FOUND]: 'Inventory record not found',

  [ErrorCode.INSUFFICIENT_STOCK]: 'Insufficient stock for this product',
  [ErrorCode.EMAIL_ALREADY_EXISTS]: 'This email address is already in use',
  [ErrorCode.INVALID_CREDENTIALS]: 'Invalid email or password',

  [ErrorCode.COMPANY_NOT_FOUND]: 'Company not found',
  [ErrorCode.NO_COMPANY]: 'You must create or join a company first',
  [ErrorCode.ALREADY_IN_COMPANY]: 'This user already belongs to a company',
  [ErrorCode.MEMBER_NOT_FOUND]: 'Company member not found',
  [ErrorCode.OWNER_ONLY]: 'Only the company owner can perform this action',
  [ErrorCode.INVALID_MEMBER_ROLE]: 'Cannot assign the owner role to employees',
  [ErrorCode.CANNOT_CHANGE_OWN_ROLE]: 'You cannot change your own role',
  [ErrorCode.CANNOT_REMOVE_SELF]: 'You cannot remove yourself from the company',
  [ErrorCode.CANNOT_MODIFY_OWNER]: 'The company owner cannot be modified or removed',
};
