import express from 'express';
import { listUsers,getUser,deleteUser, updateUser }  from '../controllers/UserController';
import { requireAuth, checkPermission } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/',
  requireAuth,
  checkPermission('users:read'),
  listUsers
);

router.get('/:id',
  requireAuth,
  checkPermission('users:read'),
  getUser
);

router.put('/:id',
  requireAuth,
  checkPermission('users:update'),
  updateUser
);

router.delete('/:id',
  requireAuth,
  checkPermission('users:delete'),
  deleteUser
);

export default router;