import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuditMiddleware implements NestMiddleware {
  use(req: Request & { auditContext?: Record<string, unknown> }, _res: Response, next: NextFunction) {
    req.auditContext = {
      method: req.method,
      route: req.originalUrl,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    };
    next();
  }
}
