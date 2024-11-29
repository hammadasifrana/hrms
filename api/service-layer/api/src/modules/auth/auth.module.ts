import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from '../../services/auth.service';

// Import necessary entities
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';
import { Permission } from '../../entities/permission.entity';

// Import guards and strategies
import { JwtStrategy } from '../common/guards/strategies/jwt.strategy';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { ClientRepository } from "../../repositories/client.repository";
import { CommonModule } from "../common/common.module";
import { ClientService } from "../../services/client.service";
import { TenantContextService } from "../../services/tenant-context.service";
import { Client } from "../../entities/client.entity";
import { TenantMiddleware } from "../../middleware/tenant.middleware";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [
    CommonModule,
    // Import TypeORM entities for this module
    DatabaseModule,
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      Client
    ])
  ],
  controllers: [AuthController],
  providers: [
    // Services
    AuthService,
    ClientService,
    TenantContextService,
    ClientRepository,
    // Guards and Strategies
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    PermissionsGuard
  ],
  exports: [
    // Export services and repositories that might be used in other modules
    AuthService,
  ]
})

export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes('*');
  }
}