import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { initializeDatabase } from './config/database';
import passport from './config/passport';
import authRoutes from './routes/authRoutes';
import { environment } from './config/environment';

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeDatabase();
    }

    private initializeMiddlewares() {
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(passport.initialize());
    }

    private initializeRoutes() {
        this.app.use('/auth', authRoutes);
    }

    private async initializeDatabase() {
       await initializeDatabase();
    }

    public listen() {
        this.app.listen(environment.PORT, () => {
            console.log(`Server running on port ${environment.PORT}`);
        });
    }
}

const app = new App();
app.listen();