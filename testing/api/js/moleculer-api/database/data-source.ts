import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import {databaseConfig} from "../config/database.config";

dotenv.config();

export const AppDataSource = new DataSource(databaseConfig);

AppDataSource.initialize()
	.then(() => {
		console.log('Data Source has been initialized!');
	})
	.catch((err) => {
		console.error('Error during Data Source initialization', err);
	});
