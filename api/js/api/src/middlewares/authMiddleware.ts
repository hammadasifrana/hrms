import { Request, Response, NextFunction, RequestHandler } from 'express';
import passport from '../config/passport.config';
import { User } from '../models/User';

export const requireAuth = passport.authenticate('jwt', { session: false }) as RequestHandler;

export const checkPermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as User;

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (!user.hasPermission(permission)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      return next();
    }catch (error){
        return res.status(500).json({ message: 'Internal Server Error' });
    }

  };
};
