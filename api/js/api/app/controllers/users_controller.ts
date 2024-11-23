// import type { HttpContext } from '@adonisjs/core/http'

import type {HttpContext} from "@adonisjs/core/http";
import {registerValidator} from "#validators/auth";
import User from "#models/user";

export default class UsersController {
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
    return { user: auth.user }
  }
  async list({ auth, response }: HttpContext) {
    const users = await User.all();
    return response.ok(users)
    }
}
