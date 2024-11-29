import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { validate } from "./config/env.validation";
import { AppController } from "./controllers/app.controller";
import { AppService } from "./services/app.service";
import { TenantContextService } from "./services/tenant-context.service";
import { ClientRepository } from "./repositories/client.repository";
import { TenantMiddleware } from "./middleware/tenant.middleware";
import { ClientService } from "./services/client.service";
import { CommonModule } from "./modules/common/common.module";
import { AuthModule } from "./modules/auth/auth.module";
import { DatabaseModule } from "./modules/database/database.module"; // Import AuthModule

@Module({
  imports: [
    // Configuration Module
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    DatabaseModule,
    CommonModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ClientRepository,
    ClientService,
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