import { column, BaseModel, beforeCreate } from '@adonisjs/lucid/orm'

import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'

export default class PasswordReset extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public user_id: string

  @column()
  public token: string

  @column()
  public expires_at: DateTime

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  // Optional: You can add a method to generate a new token
  @beforeCreate()
  public static async generateToken(passwordReset: PasswordReset) {
    passwordReset.token = randomUUID()
  }
}
