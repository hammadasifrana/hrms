import { Request, Response, NextFunction } from 'express';
import passport from '../config/passport.config';
import { User } from '../models/User';

export const requireAuth = passport.authenticate('jwt', { session: false });

export const checkPermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!user.hasPermission(permission)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};