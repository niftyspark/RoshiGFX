import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const tenantHeader = request.headers['x-tenant-id'];
    const tokenTenantId = request.user?.tenantId;

    if (!tenantHeader || tenantHeader !== tokenTenantId) {
      throw new ForbiddenException('Tenant isolation policy violation');
    }

    return true;
  }
}
