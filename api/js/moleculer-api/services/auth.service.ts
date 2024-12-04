import type { Context, Service, ServiceSchema, ServiceSettingSchema } from "moleculer";
import { AppDataSource } from "../database/data-source";
import { User } from "../database/entities/user.entity";
import { LoginParams } from "../interfaces/login.interface";
import { UserRegisterParams } from "../interfaces/userRegister.interface";
import { AuthManager } from "../managers/auth.manager";
import {Role} from "../database/entities/role.entity";
import {Permission} from "../database/entities/permission.entity";
import {Client} from "../database/entities/client.entity";
import {verifyToken} from "../utils/jwt-util";
import {Tenant} from "../database/entities/tenant.entity";


interface AuthSettings extends ServiceSettingSchema {
	defaultName: string;
}

const AuthService: ServiceSchema<AuthSettings> = {
	name: "authService",
	// version: 1

	/**
	 * Mixins
	 */
	mixins: [],

	/**
	 * Settings
	 */
	settings: {
		defaultName: "auth service",
	},
	/**
	 * Action Hooks
	 */
	hooks: {
		before: {},
	},

	/**
	 * Actions
	 */
	actions: {

		// --- ADDITIONAL ACTIONS ---

		/**
		 * Increase the quantity of the User item.
		 */
		register: {
			rest: "POST /register",
			params: {
				email: "string",
				password: "string|positive",
				roleNames: "array",
			},
			async handler(ctx: Context<UserRegisterParams>): Promise<Object> {
				const userRegisterParams: UserRegisterParams = ctx.params;
				const authManager:AuthManager = new AuthManager();
				return authManager.register(userRegisterParams);
			},
		},

		login: {
			rest: "Post /login",
			params: {
				email: "string",
				password: "string",
			},
			async handler(ctx: Context<LoginParams>): Promise<Object> {
				const authManager:AuthManager = new AuthManager();
				return authManager.login(ctx.params.email, ctx.params.password);
			},
		},

		seedDB: {
			authentication: true,
			rest: "GET /seed",
			async handler(ctx: Context): Promise<string> {

				const clientRepository = AppDataSource.getRepository(Client);
				const tenantRepository = AppDataSource.getRepository(Tenant);
				const userRepository = AppDataSource.getRepository(User);
				const roleRepository = AppDataSource.getRepository(Role);
				const permissionRepository = AppDataSource.getRepository(Permission);

				const createTenant =  await tenantRepository.create({ id: 'b8fd6b99-dc56-4d33-a239-89e09517f419', name: 'Tenant 1', domain: 'localhost:3000' });

				await tenantRepository.save(createTenant);

				const createPerm = await permissionRepository.findOne({ where: { name: 'create' } })
					|| permissionRepository.create({ name: 'create', description: 'Create resources', tenantId: createTenant.id });
				const readPerm = await permissionRepository.findOne({ where: { name: 'read' } })
					|| permissionRepository.create({ name: 'read', description: 'Read resources', tenantId: createTenant.id });
				const updatePerm = await permissionRepository.findOne({ where: { name: 'update' } })
					|| permissionRepository.create({ name: 'update', description: 'Update resources', tenantId: createTenant.id });
				const deletePerm = await permissionRepository.findOne({ where: { name: 'delete' } })
					|| permissionRepository.create({ name: 'delete', description: 'Delete resources', tenantId: createTenant.id });

				await permissionRepository.save([createPerm, readPerm, updatePerm, deletePerm]);

				// Create default roles
				const userRole = await roleRepository.findOne({ where: { name: 'user' } })
					|| roleRepository.create({
						name: 'user',
						description: 'Standard user role',
						permissions: [readPerm],
						tenantId: createTenant.id
					});

				const adminRole = await roleRepository.findOne({ where: { name: 'admin' } })
					|| roleRepository.create({
						name: 'admin',
						description: 'Administrator role',
						permissions: [createPerm, readPerm, updatePerm, deletePerm],
						tenantId: createTenant.id

					});

				await roleRepository.save([userRole, adminRole]);

				return "roles and permissions added";
			},
		},

	},

	/**
	 * Methods
	 */
	methods: {
		/**
		 * Loading sample data to the collection.
		 * It is called in the DB.mixin after the database
		 * connection establishing & the collection is empty.
		 */

	},

	/**
	 * Fired after database connection establishing.
	 */
};

export default AuthService;
