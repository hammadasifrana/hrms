import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn
} from 'typeorm';
import { TenantConfiguration } from './tenant-configuration.entity';
import { Client } from './client.entity';
import { User } from './user.entity';
import { Role } from './role.entity';
import {Permission} from "./permission.entity";

@Entity('tenants')
export class Tenant {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ unique: true })
	name!: string;

	@Column({
		unique: true,
		transformer: {
			to: (value: string) => value.toLowerCase().replace(/^https?:\/\//, ''),
			from: (value: string) => value
		}
	})
	domain!: string;

	@Column({ default: true, name: 'is_active' })
	isActive!: boolean;

	@CreateDateColumn({ name: 'created_at' })
	createdAt!: Date;


	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt!: Date;

	@OneToMany(() => TenantConfiguration, config => config.tenant)
	configurations!: TenantConfiguration[];

	@OneToMany(() => Client, client => client.tenant)
	clients!: Client[];

	@OneToMany(() => User, user => user.tenant)
	users!: User[];

	@OneToMany(() => Role, role => role.tenant)
	roles!: Role[];

}
