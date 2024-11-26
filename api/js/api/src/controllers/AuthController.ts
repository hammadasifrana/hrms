import { Request, Response, NextFunction } from 'express';
import passport from '../config/passport';
import { UserService } from '../services/UserService';

export class AuthController {
  private userService = new UserService();

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roles = req.body.roles || ['user'];
      const user = await this.userService.register(req.body, roles);
      const token = this.userService.generateJWT(user);
      
      const { password:_, ...userResponse } = user;
      
      res.status(201).json({ user: userResponse, token });
    } catch (error) {
      next(error);
    }
  };

  login = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(400).json(info);

      const token = this.userService.generateJWT(user);
      const { password, ...userResponse } = user;
      
      res.json({ user: userResponse, token });
    })(req, res, next);
  };
}