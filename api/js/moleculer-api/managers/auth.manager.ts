// managers/auth.manager.ts
import { In, Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { User } from '../database/entities/user.entity';
import { Role } from '../database/entities/role.entity';
import { AppDataSource } from "../database/data-source";
import {Client} from "../database/entities/client.entity";
import jwt from "jsonwebtoken";
import {generateToken} from "../utils/jwt-util";
const { MoleculerError } = require("moleculer").Errors;

export class AuthManager {
	constructor(
		private userRepository = AppDataSource.getRepository(User),
		private clientRepository = AppDataSource.getRepository(Client),
		private roleRepository = AppDataSource.getRepository(Role),
	) {}

	async register(UserRegisterParams: any): Promise<User> {
		const { email, password, name, roleNames } = UserRegisterParams;

		// the client id should come from context
		const clientId = 'b8fd6b99-dc56-4d33-a239-89e09517f419';
		const client = await this.clientRepository.findOne({ where: { id: clientId } });

		const existingUser = await this.userRepository.findOne({
			where: {
				email,
				...(client && { clientId: client.id })
			},
			relations: ['client'] // Optional: load client relation
		});

		if (existingUser) {
			throw new MoleculerError('User already exists');
		}

		const roles = await this.roleRepository.findBy({
			name: In(roleNames),
		});

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await this.userRepository.save({
			email,
			password: hashedPassword,
			name,
			roles,
			client: client ? client : undefined
		});
		return user as User;
	}

	async login(email: string, password: string) {
		// the client id should come from context
		const clientId = 'b8fd6b99-dc56-4d33-a239-89e09517f419';
		const client = await this.clientRepository.findOne({ where: { id: clientId } });

		const user = await this.userRepository.findOne({
			where: {
				email,
				...(client && { clientId: client.id })
			},
			relations: ['roles', 'roles.permissions']
		});

		if (!user) {
			throw new MoleculerError('Invalid credentials');
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new MoleculerError('Invalid credentials');
		}

		// Generate JWT token
		const payload = {
			sub: user.id,
			email: user.email,
			clientId: user.clientId,
			roles: user.roles.map(role => role.name),
			permissions: user.roles.flatMap(role =>
				role.permissions.map(perm => perm.name)
			)
		};

		const token = generateToken(payload);

		return {
			access_token: token,
			user: {
				id: user.id,
				email: user.email,
				clientId: user.clientId,
				roles: user.roles.map(role => role.name),
				permissions: payload.permissions
			}
		};
	}
}
