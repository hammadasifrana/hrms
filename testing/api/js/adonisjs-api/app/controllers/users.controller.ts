import type { HttpContext } from "@adonisjs/core/http";
import { registerValidator } from "#validators/auth";
import UserService from "#services/user.service";

export default class UsersController {

  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator);

    // Set tenant_id from the request or a default value
    payload.tenant_id = request.tenant.id // Replace with actual tenant ID logic
    payload.roles = request.input('roleNames');

    // Call the UserService to register the user
    const user = await UserService.registerUser(payload);

    return response.created(user);
  }

  async list({ response }: HttpContext) {
    // Call the UserService to list users
    const users = await UserService.listUsers();
    return response.ok(users);
  }

  async me({ request, response }: HttpContext) {
    try {
      const user = request.user; // Get the authenticated user

      return response.ok(user);
    } catch (error) {
      return response.unauthorized({ error: 'User  not found' });
    }
  }

}
