import express from 'express';
import { UserController } from '../controllers/UserController';
import { requireAuth, checkPermission } from '../middlewares/authMiddleware';

const router = express.Router();
const userController = new UserController();

router.get('/', 
  requireAuth, 
  checkPermission('users:read'), 
  userController.listUsers
);

router.get('/:id', 
  requireAuth, 
  checkPermission('users:read'), 
  userController.getUser
);

router.put('/:id', 
  requireAuth, 
  checkPermission('users:update'), 
  userController.updateUser
);

router.delete('/:id', 
  requireAuth, 
  checkPermission('users:delete'), 
  userController.deleteUser
);

export default router;