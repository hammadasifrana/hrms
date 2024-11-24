import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'clients'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid()'))
      table.string('name').notNullable()
      table.string('email').notNullable().unique()
      table.string('phone')
      table.string('address')
      table.string('city')
      table.string('state')
      table.string('zip')
      table.string('country')
      table.enum('status', ['active', 'inactive']).defaultTo('active')
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
