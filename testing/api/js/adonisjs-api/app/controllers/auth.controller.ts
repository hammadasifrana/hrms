import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator } from '#validators/auth'
import AuthService from '#services/auth.service'
import User from '#models/user'
import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'

export default class AuthController {
  private authService = new AuthService()

  public async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const tenantId = request.tenant.id

    try {
      const { token } = await this.authService.login(email, password, tenantId)
      return response.json({ token })
    } catch (error) {
      return response.status(401).json({ message: error.message })
    }
  }

  public async forgotPassword({ request, response }) {
    const email = request.input('email')
    const message = await this.authService.forgotPassword(email, request)
    return response.send(message)
  }

  public async resetPassword({ request, response }) {
    const { token, newPassword } = request.all()
    const message = await this.authService.resetPassword(token, newPassword)
    return response.send(message)
  }
}
