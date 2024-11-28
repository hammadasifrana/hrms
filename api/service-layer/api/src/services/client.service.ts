import { Injectable } from '@nestjs/common';
import { ClientRepository } from '../repositories/client.repository';

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepository: ClientRepository
  ) {}

  async findClientByDomain(domain: string) {
    return this.clientRepository.findClientByDomain(domain);
  }
}