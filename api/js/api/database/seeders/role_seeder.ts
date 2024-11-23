import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from "#models/role";

export default class extends BaseSeeder {
  async run() {
    await Role.createMany([
      { name: 'Admin' },
      { name: 'User' },
    ])
    // Write your database queries inside the run method
  }
}
