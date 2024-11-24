import { BaseSchema } from '@adonisjs/lucid/schema'
import {randomUUID} from "node:crypto";

export default class extends BaseSchema {
  protected tableName = 'employees'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid()'))
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('email').notNullable().unique()
      table.string('phone')
      table.string('address')
      table.string('city')
      table.string('state')
      table.string('zip')
      table.string('country')
      table.string('photo')
      table.string('job_title')
      table.uuid('department_id').references('departments.id').onDelete('CASCADE').notNullable()
      table.uuid('client_id').references('clients.id').onDelete('CASCADE').notNullable()
      table.uuid('manager_id').references('employees.id')
      table.enum('status', ['active', 'inactive']).defaultTo('active')
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
