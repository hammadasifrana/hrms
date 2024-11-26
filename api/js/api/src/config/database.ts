import { DataSource } from 'typeorm';
import { environment } from './environment';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { Permission } from '../models/Permission';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'hrms_api',
  synchronize: false,
  logging: environment.NODE_ENV === 'development',
  entities: [User, Role, Permission],
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