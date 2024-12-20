import type { HttpContext } from '@adonisjs/core/http'
import {loginValidator, registerValidator} from '#validators/auth'
import User from '#models/user'

export default class AuthController {
  async login({ request, response }: HttpContext) {

    const { email, password } = await request.validateUsing(loginValidator)
    // needs to replace the following line with my implementation
    //const user = await UserService.verifyCredentials(email, password)
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return response.ok({
      token: token,
      ...user.serialize(),
    })
  }


  async logout({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const token = auth.user?.currentAccessToken.identifier
    if (!token) {
      return response.badRequest({ message: 'Token not found' })
    }
    await User.accessTokens.delete(user, token)
    return response.ok({ message: 'Logged out' })
  }


}
