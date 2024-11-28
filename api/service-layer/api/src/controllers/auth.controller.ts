import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Get, 
  Request 
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permission.guard';
import { Permissions } from '../decorators/permissions.decorator';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Get('bootstrap')
  async bootstrap() {
    await this.authService.createDefaultRolesAndPermissions();
    return { message: 'bootstrap completed' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles('user')
  @Permissions('read')
  @Get('user-resources')
  getUserResources() {
    return { message: 'Access to user resources granted' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles('admin')
  @Permissions('create', 'update', 'delete', 'read')
  @Get('admin-resources')
  getAdminResources() {
    return { message: 'Access to admin resources granted' };
  }
}