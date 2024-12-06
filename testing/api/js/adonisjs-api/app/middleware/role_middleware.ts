import {HttpContext} from "@adonisjs/core/http";

export default class RoleMiddleware {
  public async handle({ auth, response, }: HttpContext, next: () => Promise<void>, roles: string[]) {
    const user = auth.user;

    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' });
    }

    await user.load('roles');
    const userRoles = user.roles.map((role) => role.name);

    const hasRole = roles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return response.forbidden({ message: 'Access denied' });
    }

    await next();
  }
}
