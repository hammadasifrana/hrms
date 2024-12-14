import { DateTime } from 'luxon'
import { column, BaseModel, manyToMany } from '@adonisjs/lucid/orm'

export default class Tenant extends BaseModel {

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare domain: string

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime | null

}
