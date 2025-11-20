import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
    [key: string]: any;
  };
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // If response is already formatted, return as is
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // Handle paginated responses
        if (data && typeof data === 'object' && 'data' in data && 'pagination' in data) {
          return {
            success: true,
            ...data,
            meta: {
              timestamp: new Date().toISOString(),
              requestId: context.switchToHttp().getRequest()?.headers?.['x-request-id'],
            },
          };
        }

        // Handle array responses that might be paginated
        if (data && Array.isArray(data) && data.length > 0 && data[0]?.total !== undefined) {
          const pagination = {
            page: data[0]?.page || 1,
            limit: data[0]?.limit || 10,
            total: data[0]?.total || 0,
            totalPages: data[0]?.totalPages || Math.ceil((data[0]?.total || 0) / (data[0]?.limit || 10)),
          };

          return {
            success: true,
            data: data[0]?.data || data,
            pagination,
            meta: {
              timestamp: new Date().toISOString(),
              requestId: context.switchToHttp().getRequest()?.headers?.['x-request-id'],
            },
          };
        }

        // Default response
        return {
          success: true,
          data,
          meta: {
            timestamp: new Date().toISOString(),
            requestId: context.switchToHttp().getRequest()?.headers?.['x-request-id'],
          },
        };
      }),
    );
  }
}