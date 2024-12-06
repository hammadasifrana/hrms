import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToMany, ManyToOne, JoinColumn
} from 'typeorm';
import {Role} from './role.entity';
import {Tenant} from "./tenant.entity";

@Entity('permissions')
export class Permission {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({unique: true})
	name!: string;

	@Column({unique: true})
	resource!: string;

	@Column({nullable: true})
	description?: string;

	@ManyToMany(() => Role, role => role.permissions)
	roles!: Role[];
}
