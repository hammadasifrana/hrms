import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { TenantContextService } from '../../../services/tenant-context.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly tenantContextService: TenantContextService,
    private readonly jwtService: JwtService
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      // Extract token from request
      const token = this.extractTokenFromHeader(request);

      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      // Decode token without verification to get payload
      const decodedToken = this.jwtService.decode(token) as any;

      if (!decodedToken) {
        throw new UnauthorizedException('Invalid token');
      }

      // Get current tenant from context
      const currentTenant = this.tenantContextService.getCurrentTenant();

      // Validate token's client matches current tenant
      if (!currentTenant || decodedToken.clientId !== currentTenant.id) {
        throw new UnauthorizedException('Token is not valid for this tenant');
      }

      // Perform standard JWT validation
      return super.canActivate(context);
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Unauthorized');
    }
  }

  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}