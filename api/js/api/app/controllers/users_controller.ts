// import type { HttpContext } from '@adonisjs/core/http'

import type {HttpContext} from "@adonisjs/core/http";
import {registerValidator} from "#validators/auth";
import User from "#models/user";
import UserService from "#services/user_service";
import {inject} from "@adonisjs/core";

@inject()
export default class UsersController {
  constructor(private userService: UserService) {
  }
  async index({ response }) {
    return response.ok({ message: 'Hello from UsersController' })
  }

  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)
    const user = await User.create(payload);
    return response.created(user)
  }

  async me({ auth, response }: HttpContext) {
    await auth.check();
    const user = auth.user;
    await user.load('roles');
    for (const role of user.roles) {
      await role.load('permissions');
    }
    return { user: user.serialize() }
  }
  async list({ auth, response }: HttpContext) {
    //const users = await User.all();
    const users = await this.userService.listUsers()
    return response.ok(users)
    }
}
