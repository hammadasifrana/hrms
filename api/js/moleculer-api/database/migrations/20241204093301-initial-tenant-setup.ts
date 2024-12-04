// database/migrations/YYYYMMDDHHMMSS-initial-tenant-setup.ts
import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export class InitialTenantSetup implements MigrationInterface {
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

		// Insert Tenant
		await queryRunner.query(`
            INSERT INTO tenants (id, name, "isActive", "createdAt", "updatedAt")
            VALUES ($1, 'Default Tenant', true, NOW(), NOW())
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
            ($1, 'domain', 'localhost:3000', $2, NOW(), NOW())
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
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// Cleanup in reverse order
		await queryRunner.query('DELETE FROM users WHERE email IN ($1, $2)',
			['hammad+admin@test.com', 'hammad+user@test.com']);

		await queryRunner.query('DELETE FROM roles WHERE name IN ($1, $2)',
			['Admin', 'User']);

		await queryRunner.query('DELETE FROM tenant_configurations WHERE name = $1',
			['domain']);

		await queryRunner.query('DELETE FROM tenants WHERE name = $1',
			['Default Tenant']);
	}
}
