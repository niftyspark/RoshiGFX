import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class DashboardController {
  @Get()
  @Roles('Admin', 'ProcurementManager', 'Approver', 'Finance')
  getDashboard(@CurrentUser() user: { tenantId: string; roles: string[] }) {
    return {
      tenantId: user.tenantId,
      roles: user.roles,
      metrics: {
        activeSuppliers: 0,
        pendingApprovals: 0,
        monthlySpend: 0
      }
    };
  }
}
