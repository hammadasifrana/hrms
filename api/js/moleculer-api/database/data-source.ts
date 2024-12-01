import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import {databaseConfig} from "../config/database.config";

dotenv.config();

export const AppDataSource = new DataSource(databaseConfig);


AppDataSource.initialize()
	.then(() => {
		// here you can start to work with your database
	})
	.catch((error) => console.log(error))
