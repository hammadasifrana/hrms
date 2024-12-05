// database/migrations/20241204093301-initial-tenant-setup.ts
import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export class InitialTenantSetup20241204093301 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		// Generate UUIDs
		const tenantId = uuidv4();
		const adminRoleId = uuidv4();
		const userRoleId = uuidv4();
		const adminUserId = uuidv4();
		const regularUserId = uuidv4();

		// Hash passwords
		const adminPassword = await bcrypt.hash('AdminPassword123!', 10);
		const userPassword = await bcrypt.hash('UserPassword123!', 10);

		try {
			// Insert Tenant
			await queryRunner.query(`
                INSERT INTO tenants (id, name, domain, "isActive", "createdAt", "updatedAt")
                VALUES ($1, 'Default Tenant', 'localhost:3000', true, NOW(), NOW())
            `, [tenantId]);

			// Insert Roles
			await queryRunner.query(`
                INSERT INTO roles (id, name, permissions, "tenantId", "createdAt", "updatedAt")
                VALUES
                ($1, 'Admin', $2, $3, NOW(), NOW()),
                ($4, 'User', $5, $3, NOW(), NOW())
            `, [
				adminRoleId,
				JSON.stringify(['read', 'write', 'update', 'delete']),
				tenantId,
				userRoleId,
				JSON.stringify(['read'])
			]);

			// Insert Tenant Configurations
			await queryRunner.query(`
                INSERT INTO tenant_configurations (id, name, value, "tenantId", "createdAt", "updatedAt")
                VALUES
                ($1, 'additional_config', 'some_value', $2, NOW(), NOW())
            `, [uuidv4(), tenantId]);

			// Insert Users
			await queryRunner.query(`
                INSERT INTO users (id, name, email, password, "tenantId", "roleId", "createdAt", "updatedAt")
                VALUES
                ($1, 'Hammad Admin', $2, $3, $4, $5, NOW(), NOW()),
                ($6, 'Hammad User', $7, $8, $4, $9, NOW(), NOW())
            `, [
				adminUserId,
				'hammad+admin@test.com',
				adminPassword,
				tenantId,
				adminRoleId,
				regularUserId,
				'hammad+user@test.com',
				userPassword,
				userRoleId
			]);
		} catch (error) {
			console.error('Migration error:', error);
			throw error;
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		try {
			// Cleanup in reverse order

			await queryRunner.query(`
				DELETE FROM role_permissions
			`);

			await queryRunner.query(`
				DELETE FROM permissions
			`);

			await queryRunner.query(`
				DELETE FROM user_roles
			`);

			await queryRunner.query(`
                DELETE FROM roles
                WHERE name IN ('Admin', 'User')
            `);

			await queryRunner.query(`
				DELETE FROM users
				WHERE email IN ('hammad+admin@test.com', 'hammad+user@test.com')
			`);

			await queryRunner.query(`
                DELETE FROM tenant_configurations
                WHERE "tenantId" = (SELECT id FROM tenants WHERE domain = 'localhost:3000')
            `);

			await queryRunner.query(`
                DELETE FROM tenants
                WHERE domain = 'localhost:3000'
            `);
		} catch (error) {
			console.error('Rollback error:', error);
			throw error;
		}
	}
}
