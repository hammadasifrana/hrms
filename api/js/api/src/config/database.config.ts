import { DataSource } from 'typeorm';
import { environmentConfig } from './environment.config';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { Permission } from '../models/Permission';

export const AppDataSource = new DataSource({
  type: environmentConfig.DATABASE_TYPE as 'postgres' | 'mysql' | 'sqlite' | 'mariadb' | 'mssql' | 'oracle' | 'mongodb',
  host: environmentConfig.DATABASE_HOST,
  port: Number(environmentConfig.DATABASE_PORT),
  username: environmentConfig.DATABASE_USERNAME,
  password: environmentConfig.DATABASE_PASSWORD,
  database: environmentConfig.DATABASE_NAME,
  synchronize: environmentConfig.DATABASE_SYNCHRONIZE === 'true',
  logging: environmentConfig.NODE_ENV === 'development',
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