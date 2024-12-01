import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const environmentConfig = {
   PORT: process.env.PORT || 3000,
   JWT_SECRET: process.env.JWT_SECRET || 'default_secret',
   NODE_ENV: process.env.NODE_ENV || 'development',

   DATABASE_TYPE: process.env.DATABASE_TYPE || 'postgres',
   DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
   DATABASE_PORT: process.env.DATABASE_PORT || 5432,
   DATABASE_USERNAME: process.env.DATABASE_USERNAME || 'postgres',
   DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'postgres',
   DATABASE_NAME: process.env.DATABASE_NAME || 'hrms_api',
   DATABASE_SYNCHRONIZE: process.env.DATABASE_SYNCHRONIZE || false,
};