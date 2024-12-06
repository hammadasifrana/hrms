import type { Context, Service, ServiceSchema } from "moleculer";
import type { DbAdapter, DbServiceSettings, MoleculerDbMethods } from "moleculer-db";
import type MongoDbAdapter from "moleculer-db-adapter-mongo";
import { AppDataSource } from "../database/data-source";
import { User } from "../database/entities/user.entity";
import {Meta} from "../interfaces/meta.interface";

export interface UserEntity {
	_id: string;
	name: string;
	price: number;
	quantity: number;
}

export type ActionCreateParams = Partial<UserEntity>;

export interface AddUserParams {
	id: string;
	name: number;
	email: string;
}

interface UserSettings extends DbServiceSettings {
	indexes?: Record<string, number>[];
}

interface UsersThis extends Service<UserSettings>, MoleculerDbMethods {
	adapter: DbAdapter | MongoDbAdapter;
}

const UsersService: ServiceSchema<UserSettings> = {
	name: "usersService",
	// version: 1

	/**
	 * Mixins
	 */
	mixins: [],

	/**
	 * Settings
	 */
	settings: {
		// Available fields in the responses
		fields: ["_id", "name", "quantity", "price"],

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			name: "string|min:3",
			price: "number|positive",
		},

		indexes: [{ name: 1 }],
	},

	/**
	 * Action Hooks
	 */
	hooks: {
		before: {
			/**
			 * Register a before hook for the `create` action.
			 * It sets a default value for the quantity field.
			 */
			create(ctx: Context<ActionCreateParams>) {
				ctx.params.quantity = 0;
			},
		},
	},

	/**
	 * Actions
	 */
	actions: {

		// --- ADDITIONAL ACTIONS ---

		/**
		 * Increase the quantity of the User item.
		 */
		addUser: {
			rest: "POST /addUser",
			params: {
				id: "string",
				value: "number|integer|positive",
			},
			async handler(this: UsersThis, ctx: Context<AddUserParams>): Promise<string> {
				return "user added";
			},
		},

		listUsers: {
			rest: "GET /listUsers",
			async handler(this: UsersThis, ctx: Context<unknown, Meta>): Promise<Object> {
				const userRepository = AppDataSource.getRepository(User)
				return userRepository.findAndCount();
			},
		},

		seedUsers: {
			rest: "GET /seedUsers",
			async handler(this: UsersThis, ctx: Context): Promise<string> {

				const userRepository = AppDataSource.getRepository(User)
				const user:User = new User();
				user.name = "test";
				user.email = "test@test.com";
				userRepository.save(user);

				const user1 :User = new User();
				user1.name = "test 1";
				user1.email = "test1@test.com";
				userRepository.save(user1);

				const user2 :User = new User();
				user2.name = "test 1";
				user2.email = "test1@test.com";
				userRepository.save(user2);

				return "users added";
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
		async seedDB(this: UsersThis) {

		},
	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected(this: UsersThis) {
		if ("collection" in this.adapter) {
			if (this.settings.indexes) {
				await Promise.all(
					this.settings.indexes.map((index) =>
						(<MongoDbAdapter>this.adapter).collection.createIndex(index),
					),
				);
			}
		}
	},
};

export default UsersService;
