import { Module } from '@nestjs/common';
import { LoggingService } from '../../services/logging.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/role.guard';
import { PermissionsGuard } from './guards/permission.guard';
import { ValidationPipe } from './pipes/validation.pipe';
import { JwtStrategy } from "./guards/strategies/jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule, // Ensure ConfigModule is imported
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        const expiresIn = configService.get<string>('JWT_EXPIRATION', '1h'); // Default to 1 hour if not specified

        console.log('JWT Configuration:', {
          secretLength: secret?.length,
          expiresIn
        });

        if (!secret) {
          throw new Error('JWT_SECRET is not defined in the environment');
        }

        return {
          secret: secret,
          signOptions: { expiresIn },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    LoggingService,
    JwtAuthGuard,
    RolesGuard,
    PermissionsGuard,
    JwtStrategy,
    {
      provide: 'APP_PIPE',
      useClass: ValidationPipe,
    },
  ],
  exports: [
    LoggingService,
    JwtAuthGuard,
    RolesGuard,
    PermissionsGuard,
    JwtStrategy,
    JwtModule, // Export the entire JwtModule
  ],
})
export class CommonModule {}