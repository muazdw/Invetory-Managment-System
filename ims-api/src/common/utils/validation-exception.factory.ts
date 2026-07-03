import { BadRequestException, ValidationError } from '@nestjs/common';
import { ErrorCode } from '../constants/error-codes.constants';

function flattenValidationErrors(
  errors: ValidationError[],
  parent = '',
): { field: string; message: string }[] {
  const result: { field: string; message: string }[] = [];

  for (const err of errors) {
    const field = parent ? `${parent}.${err.property}` : err.property;

    if (err.constraints) {
      for (const message of Object.values(err.constraints)) {
        result.push({ field, message });
      }
    }

    if (err.children?.length) {
      result.push(...flattenValidationErrors(err.children, field));
    }
  }

  return result;
}

export function validationExceptionFactory(errors: ValidationError[]) {
  throw new BadRequestException({
    code: ErrorCode.VALIDATION_ERROR,
    message: 'Validation failed',
    errors: flattenValidationErrors(errors),
  });
}
