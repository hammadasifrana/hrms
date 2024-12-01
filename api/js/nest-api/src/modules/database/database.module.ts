// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dataSourceOptions } from '../../config/typeorm.config';

// Import all entities
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';
import { Permission } from '../../entities/permission.entity';
import { Client } from '../../entities/client.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...dataSourceOptions,
        entities: [
          User,
          Role,
          Permission,
          Client,
          // Add all your entities here
        ],
      }),
      inject: [ConfigService],
    }),
    // Feature-specific repositories
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      Client,
    ]),
  ],
  exports: [
    TypeOrmModule, // Export TypeOrmModule to be used in other modules
  ],
})
export class DatabaseModule {}