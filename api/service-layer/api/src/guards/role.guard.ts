// Role Guard implementation
import { 
    Injectable, 
    CanActivate, 
    ExecutionContext, 
    ForbiddenException 
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
  
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      // Retrieve roles set on the handler
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass()
      ]);
  
      // If no roles are specified, allow access
      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }
  
      // Get the request object
      const request = context.switchToHttp().getRequest();
      
      // Get the user from the request (assumes authentication middleware has set user)
      const user = request.user;
  
      // Check if user has any of the required roles
      const hasRequiredRole = requiredRoles.some(role => 
        user?.roles?.includes(role)
      );
  
      // Throw forbidden exception if user lacks required role
      if (!hasRequiredRole) {
        throw new ForbiddenException('Insufficient role permissions');
      }
  
      return true;
    }
  }
  