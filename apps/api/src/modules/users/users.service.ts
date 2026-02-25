import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../roles/user-role.entity';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(UserRole) private readonly userRolesRepository: Repository<UserRole>
  ) {}

  async findByEmail(email: string, tenantId: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email, tenantId } });
    if (!user) {
      return null;
    }

    const roles = await this.userRolesRepository
      .createQueryBuilder('user_roles')
      .innerJoin('roles', 'roles', 'roles.id = user_roles.role_id')
      .where('user_roles.user_id = :userId', { userId: user.id })
      .andWhere('user_roles.tenant_id = :tenantId', { tenantId })
      .select('roles.name', 'name')
      .getRawMany<{ name: string }>();

    user.roles = roles.map((entry) => entry.name);
    return user;
  }
}
