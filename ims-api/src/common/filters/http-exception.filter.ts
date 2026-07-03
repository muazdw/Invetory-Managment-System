import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCode } from '../constants/error-codes.constants';

interface ExceptionResponseBody {
  code?: string;
  message?: string | string[];
  errors?: { field: string; message: string }[];
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const body: Record<string, unknown> = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        body.code = this.codeFromStatus(status);
        body.message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const res = exceptionResponse as ExceptionResponseBody;
        body.code = res.code ?? this.codeFromStatus(status);
        body.message = Array.isArray(res.message)
          ? res.message.join(', ')
          : (res.message ?? exception.message);
        if (res.errors?.length) {
          body.errors = res.errors;
        }
      } else {
        body.code = this.codeFromStatus(status);
        body.message = exception.message;
      }
    } else {
      body.code = ErrorCode.INTERNAL_SERVER_ERROR;
      body.message = 'An unexpected error occurred';
    }

    response.status(status).json(body);
  }

  private codeFromStatus(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return ErrorCode.VALIDATION_ERROR;
      case HttpStatus.UNAUTHORIZED:
        return ErrorCode.INVALID_CREDENTIALS;
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.CONFLICT:
        return ErrorCode.EMAIL_ALREADY_EXISTS;
      default:
        return ErrorCode.INTERNAL_SERVER_ERROR;
    }
  }
}
