import { BaseSchema } from '@adonisjs/lucid/schema'
import {randomUUID} from "node:crypto";

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.uuid('tenant_id').references('tenants.id').onDelete('CASCADE').notNullable()
      table.uuid('employee_id').references('employees.id').onDelete('CASCADE').nullable()
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
