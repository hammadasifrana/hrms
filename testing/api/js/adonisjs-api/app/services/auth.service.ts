// app/Services/AuthService.ts
import jwt from 'jsonwebtoken'
import User from '#models/user'
import PasswordReset from '#models/password_reset'
import hash from '@adonisjs/core/services/hash'
import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import mail from '@adonisjs/mail/services/main'


export default class AuthService {
  private jwtSecret: string = 'your_jwt_secret' // Replace with your secret
  private jwtExpiration: string = '1h' // Token expiration time

  public async login(email: string, password: string, tenantId: string) {
    const user = await User.query()
      .preload('roles', (rolesQuery) => {
        rolesQuery.preload('permissions') // Preload permissions for each role
      })
      .where('email', email)
      .andWhere('tenant_id', tenantId) // Assuming you have a tenant_id field in your User model
      .first()

    // Check if the user exists
    if (!user) {
      throw new Error('User  not found')
    }

    // Verify the password
    const isPasswordValid = await hash.verify(user.password, password)
    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }

    const token = this.generateToken(user)
    return { token }
  }

  public async forgotPassword(email: string, request) {
    const user = await User.findBy('email', email)

    if (!user) {
      return 'User  not found'
    }

    const token = randomUUID()
    const expiresAt = DateTime.now().plus({ hours: 1 }) // Token valid for 1 hour

    await PasswordReset.create({
      user_id: user.id,
      token,
      expires_at: expiresAt.toISO(),
    })

    const resetLink = `${request.url()}/reset-password?token=${token}`

    await mail.send((message) => {
      message
        .to(user.email)
        .from('noreply@yourdomain.com')
        .subject('Password Reset Request')
        .html(`Click <a href="${resetLink}">here</a> to reset your password.`)
    })

    return 'Password reset link sent to your email'
  }

  async resetPassword(token: string, newPassword: string) {
    const passwordReset = await PasswordReset.query()
      .where('token', token)
      .where('expires_at', '>', new Date())
      .first()

    if (!passwordReset) {
      return 'Invalid or expired token'
    }

    const user = await User.find(passwordReset.user_id)
    user.password = hash.make(newPassword) // Make sure to hash the password
    await user.save()

    // Optionally, delete the password reset record
    await passwordReset.delete()

    return 'Password has been reset successfully'
  }

  private generateToken(user: User) {
    const roles = user.roles.map((role) => role.name)
    const permissionNames = user.roles.flatMap((role) =>
      role.permissions.map((permission) => permission.name)
    )

    const payload = {
      id: user.id,
      email: user.email,
      tenantId: user.tenant_id, // Include tenant information
      roles: roles,
      permissions: permissionNames,
    }

    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiration })
  }

  public verifyToken(token: string) {
    try {
      return jwt.verify(token, this.jwtSecret)
    } catch (error) {
      throw new Error('Invalid token')
    }
  }
}
