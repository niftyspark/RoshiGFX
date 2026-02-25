import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  refreshToken!: string;

  @IsString()
  tenantId!: string;
}
