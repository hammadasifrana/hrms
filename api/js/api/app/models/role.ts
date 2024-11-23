import { DateTime } from 'luxon'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { column, BaseModel, manyToMany } from '@adonisjs/lucid/orm'
import Permission from "#models/permission";
import User from "#models/user";

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  public name: string

  @manyToMany(() => Permission, {
    pivotTable: 'role_permissions',
  })
  declare skills: ManyToMany<typeof Permission>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
