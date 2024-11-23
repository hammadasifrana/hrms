import {HttpContext} from "@adonisjs/core/http";

export default class PermissionMiddleware {
  public async handle({ auth, response }: HttpContext, next: () => Promise<void>, permissions: string[]) {
    const user = auth.user;

    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' });
    }

    await user.load('roles', (rolesQuery) => rolesQuery.preload('permissions'));
    const userPermissions = user.roles.flatMap((role) => role.permissions.map((perm) => perm.name));

    const hasPermission = permissions.some((permission) => userPermissions.includes(permission));

    if (!hasPermission) {
      return response.forbidden({ message: 'Permission denied' });
    }

    await next();
  }
}
