import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(async () => {
        if (!req.user?.tenantId) {
          return;
        }
        await this.auditService.record({
          tenantId: req.user.tenantId,
          actorId: req.user.userId,
          action: `${req.method} ${req.originalUrl}`,
          entityName: 'http_request',
          metadata: req.auditContext
        });
      })
    );
  }
}
