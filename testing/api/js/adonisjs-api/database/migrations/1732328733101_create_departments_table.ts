import { BaseSchema } from '@adonisjs/lucid/schema'
import {randomUUID} from "node:crypto";

export default class extends BaseSchema {
  protected tableName = 'departments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.string('name').notNullable().unique()
      table.string('description')
      table.uuid('tenant_id').references('tenants.id').onDelete('CASCADE').notNullable()
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
