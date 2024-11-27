import { Request, Response, NextFunction, RequestHandler } from 'express';
import { UserService } from '../services/UserService';

  const userService = new UserService();

  const listUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const [users, total] = await userService.listUsers(page, limit);
      
      // Remove passwords
      const sanitizedUsers = users.map(({ password, ...user }) => user);
      
      return res.json({
        users: sanitizedUsers,
        page,
        limit,
        total
      });
    } catch (error) {
      return next(error);
    }
  };

  const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      
      const { password, ...userResponse } = user;
      return res.json(userResponse);
    } catch (error) {
      return next(error);
    }
  };

  const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { roles, ...userData } = req.body;
      
      const updatedUser = await userService.updateUser(id, userData, roles);
      
      if (!updatedUser) return res.status(404).json({ message: 'User not found' });
      
      const { password, ...userResponse } = updatedUser;
      return res.json(userResponse);
    } catch (error) {
      return next(error);
    }
  };

  const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleted = await userService.deleteUser(id);
      
      if (!deleted) return res.status(404).json({ message: 'User not found' });
      
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }

  export {listUsers, getUser, updateUser, deleteUser};