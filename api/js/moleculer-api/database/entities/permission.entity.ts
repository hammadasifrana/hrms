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

	@Column({nullable: true})
	description?: string;

	@ManyToOne(() => Tenant, tenant => tenant.permissions)
	@JoinColumn({ name: 'tenantId' })
	tenant!: Tenant;

	@Column({ name: 'tenantId' })
	tenantId!: string;


	@ManyToMany(() => Role, role => role.permissions)
	roles!: Role[];
}
