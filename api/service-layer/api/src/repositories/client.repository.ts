import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../entities/client.entity';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class ClientRepository {
  constructor(
    @InjectRepository(Client)
    private readonly repository: Repository<Client>
  ) {}

  async createClient(clientData: Partial<Client>): Promise<Client> {
    // Check for existing client
    const existingClient = await this.repository.findOne({
      where: [
        { name: clientData.name },
        { domain: clientData.domain }
      ]
    });

    if (existingClient) {
      throw new ConflictException('Client with this name or domain already exists');
    }

    const client = this.repository.create(clientData);
    return this.repository.save(client);
  }

  async findClientByDomain(domain: string): Promise<Client | null> {
    try {
      return await this.repository.findOne({
        where: {
          domain: domain.toLowerCase().trim(), // Normalize domain
          isActive: true
        },
        cache: true // Optional: enable query result caching
      });
    } catch (error) {
      console.error('Error finding client by domain:', error);
      return null;
    }
  }
}