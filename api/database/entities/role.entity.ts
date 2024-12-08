import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToMany,
	JoinTable, ManyToOne, JoinColumn
} from 'typeorm';
import {Permission} from './permission.entity';
import {Tenant} from "./tenant.entity";

@Entity('roles')
export class Role {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({unique: true})
	name!: string;

	@Column({nullable: true})
	description?: string;

	@ManyToOne(() => Tenant, tenant => tenant.roles)
	@JoinColumn({ name: 'tenant_id' })
	tenant!: Tenant;

	@Column({ name: 'tenant_id' })
	tenantId!: string;

	@ManyToMany(() => Permission, {eager: true, cascade: true})
	@JoinTable({
		name: 'roles_permissions',
		joinColumn: {name: 'role_id', referencedColumnName: 'id'},
		inverseJoinColumn: {name: 'permission_id', referencedColumnName: 'id'}
	})
	permissions!: Permission[];
}
