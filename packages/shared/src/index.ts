export const SYSTEM_ROLES = ['Admin', 'ProcurementManager', 'Approver', 'Finance'] as const;

export type SystemRole = (typeof SYSTEM_ROLES)[number];
