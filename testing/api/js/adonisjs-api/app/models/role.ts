import { DateTime } from 'luxon'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { column, BaseModel, manyToMany } from '@adonisjs/lucid/orm'
import Permission from "#models/permission";

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  public name: string

  @column()
  declare tenant_id: string

  @manyToMany(() => Permission, {
    pivotTable: 'role_permissions',
  })

  declare permissions: ManyToMany<typeof Permission>

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime
}
