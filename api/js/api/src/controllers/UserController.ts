import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
  private userService = new UserService();

  listUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const [users, total] = await this.userService.listUsers(page, limit);
      
      // Remove passwords
      const sanitizedUsers = users.map(({ password, ...user }) => user);
      
      res.json({
        users: sanitizedUsers,
        page,
        limit,
        total
      });
    } catch (error) {
      next(error);
    }
  };

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { roles, ...userData } = req.body;
      
      const updatedUser = await this.userService.updateUser(id, userData, roles);
      
      if (!updatedUser) return res.status(404).json({ message: 'User not found' });
      
      const { password, ...userResponse } = updatedUser;
      res.json(userResponse);
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleted = await this.userService.deleteUser(id);
      
      if (!deleted) return res.status(404).json({ message: 'User not found' });
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}