import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './guards/strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionsGuard } from './guards/permission.guard';
import { validate } from './config/env.validation';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { AuthController } from './controllers/auth.controller';
import { dataSourceOptions } from "./config/typeorm.config";
import { TenantContextService } from "./services/tenant-context.service";
import { ClientRepository } from "./repositories/client.repository";
import { TenantMiddleware } from "./middleware/tenant.middleware";
import { ClientService } from "./services/client.service";
import { Client } from "./entities/client.entity";

@Module({
  imports: [
    // Configuration Module
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...dataSourceOptions,
        entities: [User, Role, Permission, Client],
      }),
      inject: [ConfigService],
    }),

    // JWT and Passport Modules
    TypeOrmModule.forFeature([User, Role, Permission, Client]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get<number>('JWT_EXPIRATION')}s`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ AppController,AuthController ],
  providers: [
    AuthService,
    AppService,
    ClientRepository,
    ClientService,
    JwtStrategy,
    JwtAuthGuard,
    PermissionsGuard,
    TenantContextService,
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes('*');
  }
}