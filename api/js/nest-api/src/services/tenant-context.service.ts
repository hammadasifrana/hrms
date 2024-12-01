import { Injectable } from '@nestjs/common';
import { Client } from '../entities/client.entity';

@Injectable()
export class TenantContextService {
  private currentTenant: Client | null = null;

  setTenant(tenant: Client) {
    this.currentTenant = tenant;
  }

  getCurrentTenant(): Client | null {
    return this.currentTenant;
  }

  clearTenant() {
    this.currentTenant = null;
  }
}