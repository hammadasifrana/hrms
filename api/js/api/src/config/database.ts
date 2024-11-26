import { DataSource } from 'typeorm';
import { environment } from './environment';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { Permission } from '../models/Permission';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: environment.DATABASE_URL,
  synchronize: environment.NODE_ENV === 'development',
  logging: environment.NODE_ENV === 'development',
  entities: [User, Role, Permission],
  migrations: [],
  subscribers: []
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');
  } catch (error) {
    console.error('Error connecting to database', error);
    process.exit(1);
  }
};