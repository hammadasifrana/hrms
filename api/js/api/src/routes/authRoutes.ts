import express from 'express';
import { requireAuth, checkPermission } from '../middlewares/authMiddleware';
import {AuthController} from "../controllers/AuthController";

const router = express.Router();
const authController = new AuthController();

router.post('/register',
  authController.register
);

router.post('/login',
  authController.login
);


export default router;