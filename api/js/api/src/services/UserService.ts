import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { User, UserStatus } from '../models/User';
import { environment } from '../config/environment';

export class UserService {
  private userRepository = new UserRepository();

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async listUsers(page: number = 1, limit: number = 10): Promise<[User[], number]> {
    return this.userRepository.findAll(page, limit);
  }

  async register(userData: Partial<User>, roles: string[] = ['user']): Promise<User> {
    const { password, ...rest } = userData;
    const hashedPassword = await bcrypt.hash(password!, 10);
    
    return this.userRepository.create({
      ...rest,
      password: hashedPassword,
      status: UserStatus.ACTIVE
    }, roles);
  }

  async updateUser(
    id: string, 
    userData: Partial<User>, 
    roles?: string[]
  ): Promise<User | null> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    return this.userRepository.update(id, userData, roles);
  }

  generateJWT(user: User): string {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        roles: user.roles.map(role => role.name)
      }, 
      environment.JWT_SECRET, 
      { expiresIn: '1d' }
    );
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }
}