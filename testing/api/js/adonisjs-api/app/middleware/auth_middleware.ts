// app/Middleware/AuthMiddleware.ts
import { HttpContext } from '@adonisjs/core/http'
import AuthService from '#services/auth.service'

export default class AuthMiddleware {
  private authService = new AuthService()

  public async handle({ request, response }: HttpContext, next: () => Promise<void>) {
    const token = request.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return response.status(401).json({ message: 'Token not provided' })
    }

    try {
      const decoded = this.authService.verifyToken(token)
      request.user = decoded // Attach user info to the request
      //console.log(request.user);
      await next()
    } catch (error) {
      return response.status(401).json({ message: error.message })
    }
  }
}
