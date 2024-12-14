import Permission from "#models/permission";
import {HttpContext} from "@adonisjs/core/http";

export default class PermissionMiddleware {
  public async handle({ request , response }: HttpContext, next: () => Promise<void>, permissions: string[]) {
    
    const user = request.user;
    
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' });
    }

    const userPermissions = request.user.permissions;

    const resource = request.method() + ' ' + request.url();

   const permission = await Permission.query()
      .where('resource', resource)
      .first()
   
    if(permission) {
      const hasPermission = userPermissions.includes(permission.name);
      if (!hasPermission) {
        return response.forbidden({ message: 'Permission denied' });
     }
    }

    await next();
  }
}
