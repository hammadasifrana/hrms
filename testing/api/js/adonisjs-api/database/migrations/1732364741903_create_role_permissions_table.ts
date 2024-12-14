import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'role_permissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('role_id').references('roles.id').onDelete('CASCADE')
      table.uuid('permission_id').references('permissions.id').onDelete('CASCADE')
      })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
