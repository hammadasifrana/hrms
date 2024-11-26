import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { Permission } from '../models/Permission';

export class UserRepository {
  private repository = AppDataSource.getRepository(User);
  private roleRepository = AppDataSource.getRepository(Role);
  private permissionRepository = AppDataSource.getRepository(Permission);

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ 
      where: { email },
      relations: ['roles', 'roles.permissions']
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ 
      where: { id },
      relations: ['roles', 'roles.permissions']
    });
  }

  async findAll(page: number = 1, limit: number = 10): Promise<[User[], number]> {
    return this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['roles', 'roles.permissions']
    });
  }

  async create(userData: Partial<User>, roleNames: string[] = []): Promise<User> {
    const roles = await Promise.all(
      roleNames.map(async (roleName) => {
        let role = await this.roleRepository.findOne({ where: { name: roleName } });
        if (!role) {
          role = this.roleRepository.create({ name: roleName });
          await this.roleRepository.save(role);
        }
        return role;
      })
    );

    const user = this.repository.create({
      ...userData,
      roles
    });

    return this.repository.save(user);
  }

  async update(id: string, userData: Partial<User>, roleNames?: string[]): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;

    if (roleNames) {
      const roles = await Promise.all(
        roleNames.map(async (roleName) => {
          let role = await this.roleRepository.findOne({ where: { name: roleName } });
          if (!role) {
            role = this.roleRepository.create({ name: roleName });
            await this.roleRepository.save(role);
          }
          return role;
        })
      );
      user.roles = roles;
    }

    Object.assign(user, userData);
    return this.repository.save(user);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }
}