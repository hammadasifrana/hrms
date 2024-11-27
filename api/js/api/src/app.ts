import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { initializeDatabase } from './config/database.config';
import { corsOptions } from './config/cors.config';
import passport from './config/passport.config';
import authRoutes from './routes/authRoutes';
import { environmentConfig } from './config/environment.config';
import userRoutes from "./routes/userRoutes";

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeDatabase();
    }

    private initializeMiddlewares() {
        this.app.use(cors(corsOptions));
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(passport.initialize());
    }

    private initializeRoutes() {
        this.app.use('/auth', authRoutes);
        this.app.use('/user', userRoutes);
    }

    private async initializeDatabase() {
       await initializeDatabase();
    }

    public listen() {
        this.app.listen(environmentConfig.PORT, () => {
            console.log(`Server running on port ${environmentConfig.PORT}`);
        });
    }
}

const app = new App();
app.listen();