import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/Role'
import Permission from '#models/Permission'
import Tenant from '#models/tenant' // Assuming you have a Tenant model

export default class extends BaseSeeder {
  public async run() {
    // Create a default tenant
    const tenant = await Tenant.create({
      name: 'Default Tenant',
      domain: 'localhost:3333',
      email: 'tenant1@test.com'
      // Add other tenant fields as necessary
    })

    // Create roles associated with the tenant
    const roles = await Role.createMany([
      { name: 'admin', tenant_id: tenant.id }, // Assuming you have a tenantId field in your Role model
      { name: 'user', tenant_id: tenant.id },  // Assuming you have a tenantId field in your Role model
    ])

    // Create permissions associated with the tenant
    const permissions = await Permission.createMany([
      { name: 'listUsers', resource: 'GET /users/list' }, // Assuming you have a tenantId field in your Permission model
      { name: 'createUsers', resource: 'POST /users/register'}, // Corrected the permission name
    ])

    // Optionally, you can associate roles with permissions if needed
    // For example, if you have a many-to-many relationship between roles and permissions:
    // await roles[0].related('permissions').attach([permissions[0].id, permissions[1].id]) // Admin role gets both permissions
  }
}
