import * as dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';

dotenv.config();

export const databaseConfig: DataSourceOptions = {
	type: 'postgres',
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT || '5432', 10),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	synchronize: process.env.DB_SYNCHRONIZE === 'true',
	logging: process.env.DB_LOGGING === 'true',
	entities: [__dirname + '/../database/entities/**/*.{ts,js}'], // Adjust path as needed
	migrations: [
		__dirname + '/../database/migrations/**/*{.ts,.js}'
	],
	migrationsTableName: 'migrations'
};
