import { Request, Response, NextFunction, RequestHandler } from 'express';
import passport from '../config/passport.config';
import { User } from '../models/User';

export const requireAuth = passport.authenticate('jwt', { session: false }) as RequestHandler;

export const checkPermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as User;

    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!user.hasPermission(permission)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    next();
  };
};
