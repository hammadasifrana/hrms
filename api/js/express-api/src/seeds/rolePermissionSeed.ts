import { AppDataSource } from '../config/database.config';
import { Role } from '../models/Role';
import { Permission } from '../models/Permission';

async function seedRolesAndPermissions() {
  await AppDataSource.initialize();

  // Permissions
  const permissions = [
    { name: 'users:create', description: 'Create users' },
    { name: 'users:read', description: 'Read user information' },
    { name: 'users:update', description: 'Update user information' },
    { name: 'users:delete', description: 'Delete users' }
  ];

  const permissionRepositories = await Promise.all(
    permissions.map(async (permData) => {
      let permission = await AppDataSource.getRepository(Permission).findOne({ 
        where: { name: permData.name } 
      });
      
      if (!permission) {
        permission = AppDataSource.getRepository(Permission).create(permData);
        await AppDataSource.getRepository(Permission).save(permission);
      }
      
      return permission;
    })
  );

  // Roles
  const roles = [
    { 
      name: 'admin', 
      description: 'Full system access',
      permissions: permissionRepositories 
    },
    { 
      name: 'user', 
      description: 'Regular user access',
      permissions: [
        permissionRepositories.find(p => p.name === 'users:read')!
      ]
    }
  ];

  await Promise.all(
    roles.map(async (roleData) => {
      let role = await AppDataSource.getRepository(Role).findOne({ 
        where: { name: roleData.name } 
      });
      
      if (!role) {
        role = AppDataSource.getRepository(Role).create({
          name: roleData.name,
          description: roleData.description,
          permissions: roleData.permissions
        });
        await AppDataSource.getRepository(Role).save(role);
      }
      
      return role;
    })
  );

  console.log('Roles and Permissions seeded successfully');
  process.exit(0);
}

seedRolesAndPermissions().catch(console.error);