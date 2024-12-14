import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('user_id').references('users.id').onDelete('CASCADE')
      table.uuid('role_id').references('roles.id').onDelete('CASCADE')
      })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
