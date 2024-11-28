import {
  Injectable,
  ConflictException,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from "typeorm";
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ClientService } from "./client.service";
import { ClientRepository } from "../repositories/client.repository";
import { TenantContextService } from "./tenant-context.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private clientRepository: ClientRepository,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    private jwtService: JwtService,
    private clientService: ClientService,
    private tenantContextService: TenantContextService

  ) {}

  async createDefaultRolesAndPermissions() {
    // Create default permissions
    const createPerm = await this.permissionRepository.findOne({ where: { name: 'create' } })
      || this.permissionRepository.create({ name: 'create', description: 'Create resources' });
    const readPerm = await this.permissionRepository.findOne({ where: { name: 'read' } })
      || this.permissionRepository.create({ name: 'read', description: 'Read resources' });
    const updatePerm = await this.permissionRepository.findOne({ where: { name: 'update' } })
      || this.permissionRepository.create({ name: 'update', description: 'Update resources' });
    const deletePerm = await this.permissionRepository.findOne({ where: { name: 'delete' } })
      || this.permissionRepository.create({ name: 'delete', description: 'Delete resources' });

    await this.permissionRepository.save([createPerm, readPerm, updatePerm, deletePerm]);

    // Create default roles
    const userRole = await this.roleRepository.findOne({ where: { name: 'user' } })
      || this.roleRepository.create({
        name: 'user',
        description: 'Standard user role',
        permissions: [readPerm]
      });

    const adminRole = await this.roleRepository.findOne({ where: { name: 'admin' } })
      || this.roleRepository.create({
        name: 'admin',
        description: 'Administrator role',
        permissions: [createPerm, readPerm, updatePerm, deletePerm]
      });

    await this.roleRepository.save([userRole, adminRole]);

    return { userRole, adminRole };
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name, roleNames} = createUserDto;

    const client = this.tenantContextService.getCurrentTenant();

    // Ensure default roles exist
    const { userRole, adminRole } = await this.createDefaultRolesAndPermissions();

    const existingUser = await this.userRepository.findOne({
      where: {
        email,
        ...(client && { clientId: client.id })
      },
      relations: ['client'] // Optional: load client relation
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const roles = await this.roleRepository.findBy({
        name: In(createUserDto.roleNames),
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Find client if domain is provided

    // Create new user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      roles,
      client
    });

    return this.userRepository.save(user);
  }

  async login(email: string, password: string) {
    const client = this.tenantContextService.getCurrentTenant();


    const user = await this.userRepository.findOne({
      where: { email,
        ...(client && { clientId: client.id })
      },
      relations: ['roles', 'roles.permissions']
    });

    /*// Find user with optional tenant filtering
    const user = await this.userRepository.findUserByCredentials(
      email,
      password,
      currentTenant
    );
*/
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      clientId: user.clientId,
      roles: user.roles.map(role => role.name),
      permissions: user.roles.flatMap(role =>
        role.permissions.map(perm => perm.name)
      )
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        clientId: user.clientId,
        roles: user.roles.map(role => role.name),
        permissions: payload.permissions
      }
    };
  }
}