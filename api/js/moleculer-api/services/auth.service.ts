import type { Context, Service, ServiceSchema, ServiceSettingSchema } from "moleculer";
import { AppDataSource } from "../database/data-source";
import { User } from "../database/entities/user.entity";
import { LoginParams } from "../interfaces/login.interface";
import { UserRegisterParams } from "../interfaces/userRegister.interface";
import { AuthManager } from "../managers/auth.manager";
import {Role} from "../database/entities/role.entity";
import {Permission} from "../database/entities/permission.entity";
import {Client} from "../database/entities/client.entity";
import {verifyToken} from "../utils/jwt.util";
import {Tenant} from "../database/entities/tenant.entity";
import {Meta} from "../interfaces/meta.interface";


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
			async handler(ctx: Context<UserRegisterParams, Meta>): Promise<Object> {
				const tenantId = ctx.meta.tenantId || '';
				const userRegisterParams: UserRegisterParams = ctx.params;
				const authManager:AuthManager = new AuthManager();
				return authManager.register(userRegisterParams, tenantId);
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

				const tenantRepository = AppDataSource.getRepository(Tenant);
				const roleRepository = AppDataSource.getRepository(Role);
				const permissionRepository = AppDataSource.getRepository(Permission);

				// const createTenant =  await tenantRepository.create({ id: 'b8fd6b99-dc56-4d33-a239-89e09517f419', name: 'Tenant 1', domain: 'localhost:3000' });
				// await tenantRepository.save(createTenant);

				const tenant = await tenantRepository.findOne({ where: { name: 'Tenant 1' } })
					|| tenantRepository.create({ name: 'Tenant 1', domain: 'localhost:3000' });

				const listUsers = await permissionRepository.findOne({ where: { name: 'listUsers'} })
					|| permissionRepository.create({ name: 'listUsers', description: 'List users', resource: 'GET /api/users/' });

				await permissionRepository.save([listUsers]);

				// Create default roles
				const userRole = await roleRepository.findOne({ where: { name: 'user' } })
					|| roleRepository.create({
						name: 'user',
						description: 'Standard user role',
						permissions: [],
						tenantId: tenant.id
					});

				const adminRole = await roleRepository.findOne({ where: { name: 'admin' } })
					|| roleRepository.create({
						name: 'admin',
						description: 'Administrator role',
						permissions: [listUsers],
						tenantId: tenant.id

					});

				await roleRepository.save([userRole, adminRole]);

				return "seed completed";
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
