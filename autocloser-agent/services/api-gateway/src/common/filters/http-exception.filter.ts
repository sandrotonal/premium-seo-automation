import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { getLogger } from '../utils/logger';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = getLogger('HttpExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let errors: any[] | null = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || exception.message;
        errors = (exceptionResponse as any).errors || null;
      } else {
        message = exceptionResponse as string;
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      this.logger.error('Unhandled exception:', exception);
    }

    // Log error details
    const errorLog = {
      url: request.url,
      method: request.method,
      ip: request.ip,
      userAgent: request.get('user-agent'),
      userId: (request as any).user?.id,
      status,
      message,
      errors,
      stack: exception instanceof Error ? exception.stack : undefined,
    };

    if (status >= 500) {
      this.logger.error('Server error:', errorLog);
    } else if (status >= 400) {
      this.logger.warn('Client error:', errorLog);
    } else {
      this.logger.info('Request error:', errorLog);
    }

    // Prepare response
    const errorResponse: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    };

    // Include errors array for validation errors
    if (errors && Array.isArray(errors)) {
      errorResponse.errors = errors;
    }

    // Include additional details in development
    if (process.env.NODE_ENV === 'development') {
      errorResponse.stack = exception instanceof Error ? exception.stack : undefined;
      errorResponse.exception = exception.constructor.name;
    }

    // Set response
    response.status(status).json(errorResponse);
  }
}