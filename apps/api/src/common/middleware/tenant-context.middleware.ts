import { Injectable, NestMiddleware } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  constructor(private readonly dataSource: DataSource) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'];
    if (typeof tenantId === 'string' && tenantId.length > 0) {
      await this.dataSource.query('SELECT set_config($1, $2, true)', [
        'app.current_tenant_id',
        tenantId
      ]);
    }
    next();
  }
}
