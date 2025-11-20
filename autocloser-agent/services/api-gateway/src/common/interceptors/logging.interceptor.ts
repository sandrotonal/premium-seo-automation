import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';
import { getLogger } from '../utils/logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = getLogger('Request');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const userId = (request as any).user?.id;
    
    const startTime = Date.now();

    this.logger.log({
      event: 'request_started',
      method,
      url,
      ip,
      userAgent,
      userId,
      timestamp: new Date().toISOString(),
    });

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - startTime;
        const { statusCode } = response;

        this.logger.log({
          event: 'request_completed',
          method,
          url,
          statusCode,
          duration: `${duration}ms`,
          userId,
          timestamp: new Date().toISOString(),
        });
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        const { statusCode } = response;

        this.logger.error({
          event: 'request_error',
          method,
          url,
          statusCode,
          duration: `${duration}ms`,
          error: error.message,
          userId,
          timestamp: new Date().toISOString(),
        });

        throw error;
      })
    );
  }
}