// src/middleware/tenant.middleware.ts
import {
  Injectable,
  NestMiddleware
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContextService } from '../services/tenant-context.service';
import { ClientRepository } from '../repositories/client.repository';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    private readonly tenantContextService: TenantContextService,
    private readonly clientRepository: ClientRepository
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const host = req.get('host');
    const subdomain = host.split('.')[0];

    // Find client by subdomain
    const client = await this.clientRepository.findClientByDomain(subdomain);

    if (client) {
      this.tenantContextService.setTenant(client);
    }

    next();
  }
}